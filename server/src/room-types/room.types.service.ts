import { InjectModel } from "@nestjs/mongoose"
import { MediaService } from "src/media/media.service"
import { AttributesService } from "src/attributes/attributes.service"
import { BadRequestException, Injectable } from "@nestjs/common"
import { RoomType, RoomTypeModel } from "./schemas/room.type.schema"
import { CreateRoomTypeBodyDto } from "./dto/create.room.type.dto"
import { File } from "multer"
import { UpdateRoomTypeBodyDto } from "./dto/update.room.type.dto"
import { GetRoomTypesBodyDto, GetRoomTypesQueryDto } from "./dto/get.room.types.dto"
import { DuplicateAttributesException, RoomTypeExpectedMediaUploadException, RoomTypeNameNotUniqueException, RoomTypeNotFoundException } from "./room.types.exceptions"
import { PageNotFoundException } from "src/common/exceptions.common"
import { OnEvent } from "@nestjs/event-emitter"

@Injectable()
export class RoomsTypesService {
  constructor(
    @InjectModel(RoomType.name) private readonly roomTypesModel: RoomTypeModel,
    private readonly mediaService: MediaService,
    private readonly attributeService: AttributesService,
  ) {}

  async createRoomType(body: CreateRoomTypeBodyDto, files: File[], file: File) {
    const existingRoomType = await this.roomTypesModel.findOne({ name: body.name })
    if (existingRoomType) { throw new RoomTypeNameNotUniqueException }
    const roomTypeObject = {
      name: body.name,
      description: body.description,
      mainImageId: null,
      imageIds: [],
      attributeIds: []
    }
    const attributes = (body.attributeId || body.attributeIds) ? [...(body.attributeId || []), ...(body.attributeIds || [])] : undefined
    if (attributes) {
      const attributeService = this.attributeService
      await Promise.all(body.attributeIds.map(async function (attributeId) {
        await attributeService.getAttribute(attributeId)
      }))
      const uniqueAttributes = new Set(attributes)
      if (uniqueAttributes.size !== attributes.length) { throw new DuplicateAttributesException }
      roomTypeObject.attributeIds = attributes
    }
    let mainImageMediaBody
    if (body["main.type"]) {
      if (body["main.type"] === "file") {
        if (file === undefined) { throw new RoomTypeExpectedMediaUploadException }
        mainImageMediaBody = { type: "file", file: file }
      }
      if (body["main.type"] === "url") {
        if (body["main.location"] === undefined) { throw new RoomTypeExpectedMediaUploadException }
        mainImageMediaBody = { type: "url", location: body["main.location"] }
      }
    }
    const imagesMediaBody = []
    let locations = (body.locations || body.location) ? [...(body.locations || []), ...(body.location || [])] : undefined
    if (locations) {
      await Promise.all(locations.map(function(location) {
        imagesMediaBody.push({ type: "url", location: location })
      }))
    }
    if (files) {
      await Promise.all(files.map(function(file) {
        imagesMediaBody.push({ type: "file", file: file })
      }))
    }
    if (mainImageMediaBody) {
      const image = await this.mediaService.createMedia(mainImageMediaBody)
      roomTypeObject.mainImageId = image._id.toString()
    }
    const mediaService = this.mediaService
    await Promise.all(imagesMediaBody.map(async function(imageMediaBody) {
      const image = await mediaService.createMedia(imageMediaBody)
      roomTypeObject.imageIds.push(image._id.toString())
    }))
    const roomtype = await this.roomTypesModel.create(roomTypeObject)
    try {
      return await this.getRoomType(roomtype._id.toString())
    } catch (err) {
      throw err
    }
  }

  async getRoomTypes(query: GetRoomTypesQueryDto, body: GetRoomTypesBodyDto) {
    const populate = [
      { path: "imageIds", model: "Media" },
      { path: "mainImageId", model: "Media" },
      { path: "attributeIds", model: "Attribute", populate: [{ path: "imageId", model: "Media" }] }
    ]
    const filter: any = {}
    if (body.name !== undefined) {
      filter.name = body.partial ? { $regex: body.name, $options: "i" } : body.name
    }
    if (body.capacity) { filter.capacity = body.capacity }
    if (body.attributeIds && body.attributeIds.length > 0) { filter.attributeIds = body.partial ? { $all: body.attributeIds } : { $size: body.attributeIds.length, $all: body.attributeIds } }
    const roomTypes =  await this.roomTypesModel.paginate(filter, { page: query.page, limit: query.limit, populate: populate })
    if (query.page > roomTypes.totalPages) { throw new PageNotFoundException }
    const mediaService = this.mediaService
      roomTypes.docs = await Promise.all(roomTypes.docs.map(async function (roomType: any) {
        roomType = roomType.toObject()
        roomType.images = roomType.imageIds
        roomType.mainImage = roomType.mainImageId
        roomType.attributes = roomType.attributeIds
        delete roomType.imageIds
        delete roomType.mainImageId
        delete roomType.attributeIds
        if (roomType.mainImage && roomType.mainImage.type === "file") {
          roomType.mainImage.location = await mediaService.getMediaStreamLocation(roomType.mainImage._id.toString())
        }
        await Promise.all(roomType.images.map(async function(image) {
          if (image.type === "file") {
            image.location = await mediaService.getMediaStreamLocation(image._id.toString())
          }
        }))
        await Promise.all(roomType.attributes.map(async function(attribute) {
          attribute.image = attribute.imageId
          delete attribute.imageId
          if (attribute.image && attribute.image.type === "file") {
            attribute.image.location = await mediaService.getMediaStreamLocation(attribute.image._id.toString())
          }
        }))
        return roomType
      }))
      return roomTypes
  }

  async getRoomType(roomTypeId: string) {
    const roomType = await this.roomTypesModel.findById(roomTypeId).populate([
      { path: "imageIds", model: "Media" },
      { path: "mainImageId", model: "Media" },
      { path: "attributeIds", model: "Attribute", populate: [{ path: "imageId", model: "Media" }] }
    ]).exec()
    if (!roomType) { throw new RoomTypeNotFoundException }
    const roomTypeObject: any = roomType.toObject()
    roomTypeObject.images = roomTypeObject.imageIds
    roomTypeObject.mainImage = roomTypeObject.mainImageId
    roomTypeObject.attributes = roomTypeObject.attributeIds
    const mediaService = this.mediaService
    await Promise.all(roomTypeObject.attributes.map(async function(attribute) {
      attribute.image = attribute.imageId
      delete attribute.imageId
      if (attribute.image && attribute.image.type === "file") {
        attribute.image.location = await mediaService.getMediaStreamLocation(attribute.image._id.toString())
      }
    }))
    delete roomTypeObject.imageIds
    delete roomTypeObject.mainImageId
    delete roomTypeObject.attributeIds
    return roomTypeObject
  }

  async updateRoomType(roomTypeId: string, body: UpdateRoomTypeBodyDto, files: File[], file: File) {
    const roomType = await this.roomTypesModel.findById(roomTypeId).exec()
    if (!roomType) { throw new RoomTypeNotFoundException }
    if (body.name) {
      const existingRoomType = await this.roomTypesModel.findOne({ name: body.name })
      if (existingRoomType) { throw new RoomTypeNameNotUniqueException }
    }
    const attributes = (body.attributeId || body.attributeIds) ? [...(body.attributeId || []), ...(body.attributeIds || [])] : undefined
    if (attributes) {
      const attributeService = this.attributeService
      await Promise.all(body.attributeIds.map(async function (attributeId) {
        await attributeService.getAttribute(attributeId)
      }))
      const uniqueAttributes = new Set(attributes)
      if (uniqueAttributes.size !== attributes.length) { throw new DuplicateAttributesException }
      roomType.attributeIds = attributes
    }
    let mainImageMediaBody
    if (body["main.type"]) {
      if (body["main.type"] === "file") {
        if (file === undefined) { throw new RoomTypeExpectedMediaUploadException }
        mainImageMediaBody = { type: "file", file: file }
      }
      if (body["main.type"] === "url") {
        if (body["main.location"] === undefined) { throw new RoomTypeExpectedMediaUploadException }
        mainImageMediaBody = { type: "url", location: body["main.location"] }
      }
    } else {
      if (body["main.location"] === "null") {
        if (roomType.mainImageId === undefined) {
          throw new BadRequestException("RoomType already not have main image")
        }
        await this.mediaService.deleteMedia(roomType.mainImageId)
        roomType.mainImageId = null
      }
    }
    let locations = (body.locations || body.location) ? [...(body.locations || []), ...(body.location || [])] : undefined
    const imagesMediaBody = []
    if (locations || files) {
      const mediaService = this.mediaService
      await Promise.all(roomType.imageIds.map(async function(imageId) {
        await mediaService.deleteMedia(imageId)
      }))
      roomType.imageIds = []
    }
    if (locations) {
      await Promise.all(locations.map(function(location) {
        imagesMediaBody.push({ type: "url", location: location })
      }))
    }
    if (files) {
      await Promise.all(files.map(function(file) {
        imagesMediaBody.push({ type: "file", file: file })
      }))
    }
    const mediaService = this.mediaService
    await Promise.all(imagesMediaBody.map(async function(imageMediaBody) {
      const image = await mediaService.createMedia(imageMediaBody)
      roomType.imageIds.push(image._id.toString())
    }))
    if (mainImageMediaBody) {
      if (roomType.mainImageId) { await this.mediaService.deleteMedia(roomType.mainImageId) }
      const image = await this.mediaService.createMedia(mainImageMediaBody)
      roomType.mainImageId = image._id.toString()
    }
    await roomType.save()
    try {
      return await this.getRoomType(roomType._id.toString())
    } catch (err) {
      throw err
    }
  }

  async deleteRoomType(roomTypeId: string) {
    const roomType = await this.roomTypesModel.findById(roomTypeId).exec()
    if (!roomType) { throw new RoomTypeNotFoundException }
    const mediaService = this.mediaService
    await Promise.all(roomType.imageIds.map(async function(imageId) {
      await mediaService.deleteMedia(imageId)
    }))
    if (roomType.mainImageId) {
      await this.mediaService.deleteMedia(roomType.mainImageId)
    }
    this.roomTypesModel.findByIdAndDelete(roomTypeId).exec()
    return
  }

  @OnEvent("attribute.deleted")
  async handleAttributeDeleted(attributeId: string) {}
}