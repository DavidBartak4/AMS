import { InjectModel } from "@nestjs/mongoose"
import { MediaService } from "src/media/media.service"
import { AttributesService } from "src/attributes/attributes.service"
import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common"
import { RoomType, RoomTypeModel } from "./schemas/room.type.schema"
import { CreateRoomTypeBodyDto } from "./dto/create.room.type.dto"
import { File } from "multer"
import { UpdateRoomTypeBodyDto } from "./dto/update.room.type.dto"
import { GetRoomTypesBodyDto, GetRoomTypesQueryDto } from "./dto/get.room.types.dto"

@Injectable()
export class RoomsTypesService {
  constructor(
    @InjectModel(RoomType.name) private readonly roomTypesModel: RoomTypeModel,
    private readonly mediaService: MediaService,
    private readonly attributeService: AttributesService,
  ) {}

  /*
  async createRoomType(body: CreateRoomTypeBodyDto, files: File[]) {
    const existingRoomTypes = await this.getRoomTypes({ name: body.name }, {})
    if (existingRoomTypes.docs.length > 0) {
      throw new ConflictException("Room type with this name already exists")
    }
    const { mainImageId, mainImage } = await this.handleMainImage(body, files)
    const { imageIds, images } = await this.handleOtherImages(body, files)
    const attributes = body.attributeIds ? await this.handleAttributes(body.attributeIds) : []
    let roomType: any = await this.roomTypesModel.create({
      name: body.name,
      mainImageId,
      description: body.description,
      capacity: body.capacity,
      imageIds,
      attributeIds: body.attributeIds || [],
    })
    return this.transformRoomTypeResponse(roomType, images, mainImage, attributes)
  }

  async updateRoomType(roomTypeId: string, body: UpdateRoomTypeBodyDto, files: File[]) {
    const roomType: any = await this.getRoomTypeById(roomTypeId)
    if (body.attributeIds) {
      const attributes = await this.handleAttributes(body.attributeIds)
      roomType.attributeIds = body.attributeIds
      roomType.attributes = attributes
    }
    if (body.name && body.name !== roomType.name) {
      const existingRoomTypes = await this.getRoomTypes({ name: body.name }, {})
      if (existingRoomTypes.docs.length > 0) throw new ConflictException("Room type with this name already exists")
      roomType.name = body.name
    }
    const { mainImageId, mainImage } = await this.handleMainImage(body, files, roomType.mainImageId)
    if (mainImageId) roomType.mainImageId = mainImageId
    if (files.length > 0 || body.locations) {
      await this.deleteImages(roomType.imageIds)
      const { imageIds, images } = await this.handleOtherImages(body, files)
      roomType.imageIds = imageIds
      roomType.images = images
    }
    roomType.capacity = body.capacity || roomType.capacity
    roomType.description = body.description || roomType.description
    await roomType.save()
    return this.transformRoomTypeResponse(roomType, roomType.images, mainImage, roomType.attributes)
  }

  async getRoomType(roomTypeId: string) {
    let roomType: any = await this.roomTypesModel.findById(roomTypeId).populate([
      { path: "mainImageId", model: "Media" },
      { path: "imageIds", model: "Media" },
      { path: "attributeIds", model: "Attribute" },
    ])
    if (!roomType) { throw new NotFoundException(`Room type with ID ${roomTypeId} not found`) }
    roomType = roomType.toObject()
    roomType.mainImage = roomType.mainImageId
    roomType.images = roomType.imageIds
    roomType.attributes = roomType.attributeIds
    roomType.mainImageId = undefined
    roomType.imageIds = undefined
    roomType.attributeIds = undefined
    return roomType
  }

  async getRoomTypes(body: GetRoomTypesBodyDto, query: GetRoomTypesQueryDto) {
    const filter: any = {}
    if (body.name) { filter.name = body.partial ? { $regex: body.name, $options: "i" } : body.name }
    if (body.capacity) { filter.capacity = body.capacity }
    if (body.attributeIds && body.attributeIds.length > 0) { filter.attributeIds = body.partial ? { $all: body.attributeIds } : { $size: body.attributeIds.length, $all: body.attributeIds } }
    const roomTypes = await this.roomTypesModel.paginate(filter, { page: query.page, limit: query.limit, populate: [
      { path: "imageIds", model: "Media" },
      { path: "mainImageId", model: "Media"},
      { path: "attributeIds", model: "Attribute"}
    ]})
    if (query.page > roomTypes.totalPages) { throw new NotFoundException("Page not found") }
    roomTypes.docs = await Promise.all(roomTypes.docs.map(async function (roomType: any) {
      roomType = roomType.toObject()
      roomType.images = roomType.imageIds
      roomType.mainImage = roomType.mainImageId
      roomType.attributes = roomType.attributeIds
      roomType.mainImageId = undefined
      roomType.imageIds = undefined
      roomType.attributeIds = undefined
      return roomType
    }))
    return roomTypes
  }

  async deleteRoomType(roomTypeId: string) {
    const roomType = await this.getRoomTypeById(roomTypeId)
    await this.deleteImages([roomType.mainImageId, ...roomType.imageIds])
    await this.roomTypesModel.findByIdAndDelete(roomTypeId)
    return
  }

  private async handleMainImage(body: any, files: File[], existingMainImageId?: string) {
    let mainImageId
    let mainImage
    if (body["main.type"]) {
      const index = body["main.index"]
      const file = files[index]
      const location = body.locations?.[index] || body.location?.[index]
      if ((body["main.type"] === "file" && !file) || (body["main.type"] === "url" && !location)) {
        throw new BadRequestException("No associated image for provided main.index")
      }
      if (existingMainImageId) await this.mediaService.deleteMedia(existingMainImageId.toString())
      const media = await this.mediaService.createMedia({ file, type: body["main.type"], location })
      mainImageId = media._id
      mainImage = media
    }
    return { mainImageId, mainImage }
  }

  private async handleOtherImages(body: any, files: File[]) {
    const imageIds: string[] = []
    const images: any[] = []
    for (const [index, file] of files.entries()) {
      const media = await this.mediaService.createMedia({ file, type: "file" })
      imageIds.push(media._id.toString())
      images.push(media)
    }
    if (body.locations) {
      for (const [index, location] of body.locations.entries()) {
        const media = await this.mediaService.createMedia({ location, type: "url" })
        imageIds.push(media._id.toString())
        images.push(media)
      }
    }
    return { imageIds, images }
  }

  private async handleAttributes(attributeIds: string[]) {
    return await Promise.all(
      attributeIds.map(async (id) => {
        try {
          return await this.attributeService.getAttribute(id)
        } catch {
          throw new BadRequestException(`Could not find attribute with ID ${id}`)
        }
      }),
    )
  }

  private async deleteImages(imageIds: string[]) {
    for (const imageId of imageIds) {
      if (imageId) await this.mediaService.deleteMedia(imageId.toString())
    }
  }

  private async getRoomTypeById(roomTypeId: string) {
    const roomType = await this.roomTypesModel.findById(roomTypeId)
    if (!roomType) throw new NotFoundException(`Room type with ID ${roomTypeId} not found`)
    return roomType
  }

  private transformRoomTypeResponse(roomType: any, images: any[], mainImage: any, attributes: any[]) {
    const transformed = roomType.toObject()
    transformed.images = images
    transformed.mainImage = mainImage
    transformed.attributes = attributes
    delete transformed.imageIds
    delete transformed.mainImageId
    delete transformed.attributeIds
    return transformed
  }
  */
}