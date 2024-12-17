import { BadRequestException, Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Room } from "./schemas/room.schema"
import { MediaService } from "src/media/media.service"
import { CreatetRoomBodyDto } from "./dto/create.room.dto"
import { RoomModel } from "./schemas/room.schema"
import { GetRoomsBodyDto, GetRoomsQueryDto } from "./dto/get.rooms.dto"
import { AttributesService } from "src/attributes/attributes.service"
import { OnEvent } from "@nestjs/event-emitter"
import { UpdateRoomBodyDto } from "./dto/update.room.dto"
import { File } from "multer"

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name) private readonly roomModel: RoomModel,
    private readonly mediaService: MediaService,
    private readonly attributeService: AttributesService,
  ) {}

  async createRoom(body: CreatetRoomBodyDto, files: File[]) {
    body.location = body.location || []
    let mainImageId
    if (body["main.type"]) {
      const file = files[body["main.index"]]
      const location = body.location[body["main.index"]]
      if (
        (body["main.type"] === "file" && !file) ||
        (body["main.type"] === "url" && !location)
      ) {
        throw new BadRequestException(
          "No associated image for provided main.index",
        )
      }
      const media = await this.mediaService.createMedia({
        file: file,
        type: body["main.type"],
        location: location,
      })
      mainImageId = media._id
    }
    const imageIds = []
    for (const [index, file] of files.entries()) {
      if (body["main.type"] !== "file" || body["main.index"] !== index) {
        const media = await this.mediaService.createMedia({
          file,
          type: "file",
        })
        imageIds.push(media._id.toString())
      }
    }
    for (const [index, location] of body.location.entries()) {
      if (body["main.type"] !== "url" || body["main.index"] !== index) {
        const media = await this.mediaService.createMedia({
          location: location,
          type: "url",
        })
        imageIds.push(media._id.toString())
      }
    }
    const room = await this.roomModel.create({
      name: body.name,
      number: body.number,
      description: body.description,
      capacity: body.capacity,
      price: { value: body.price, currency: body["price.currency"] },
      mainImageId,
      imageIds,
      attributeIds: body.attributeIds,
    })
    let attributes = []
    if (body.attributeIds) {
      attributes = await Promise.all(
        body.attributeIds.map((id) => this.attributeService.getAttribute(id)),
      )
    }
    return {
      __v: room.__v,
      _id: room._id,
      name: room.name,
      number: room.number,
      description: room.description,
      capacity: room.capacity,
      price: room.price,
      mainImage: mainImageId
        ? await this.mediaService.getMediaInfo(mainImageId)
        : null,
      images: await Promise.all(
        imageIds.map((id) => this.mediaService.getMediaInfo(id)),
      ),
      attributes: attributes,
    }
  }

  async getRoom(roomId: string) {
    const room = await this.roomModel.findById(roomId).exec()
    if (!room) {
      throw new BadRequestException(`Room with ID ${roomId} not found`)
    }
    const mainImage = room.mainImageId
      ? await this.mediaService.getMediaInfo(room.mainImageId)
      : null
    const images = await Promise.all(
      room.imageIds.map((id) => this.mediaService.getMediaInfo(id)),
    )
    const attributes = await Promise.all(
      room.attributeIds.map((id) => this.attributeService.getAttribute(id)),
    )
    return {
      __v: room.__v,
      _id: room._id,
      name: room.name,
      number: room.number,
      description: room.description,
      capacity: room.capacity,
      price: room.price,
      mainImage: mainImage,
      images: images,
      attributes: attributes,
    }
  }

  async getRooms(body: GetRoomsBodyDto, query: GetRoomsQueryDto) {
    const { name, number, capacity, roomType, price } = body
    const filters: any = {}
    if (name) {
      filters.name = { $regex: new RegExp(name, "i") }
    }
    if (number) {
      filters.number = number
    }
    if (capacity) {
      filters.capacity = capacity
    }
    if (roomType) {
      filters.roomType = roomType
    }
    if (price) {
      if (price.value) {
        filters["price.value"] = price.value
      }
      if (price.range) {
        filters["price.value"] = {
          $gte: price.range.min,
          $lte: price.range.max,
        }
      }
      if (price.currency) {
        filters["price.currency"] = price.currency
      }
    }
    const options = { limit: query.limit, page: query.page }
    const result = await this.roomModel.paginate(filters, options)
    const rooms = await Promise.all(
      result.docs.map(async (room) => {
        const mainImage = room.mainImageId
          ? await this.mediaService.getMediaInfo(room.mainImageId)
          : null
        const images = await Promise.all(
          (room.imageIds || []).map((id) => this.mediaService.getMediaInfo(id)),
        )
        const attributes = await Promise.all(
          (room.attributeIds || []).map((id) =>
            this.attributeService.getAttribute(id),
          ),
        )
        return {
          __v: room.__v,
          _id: room._id,
          name: room.name,
          number: room.number,
          description: room.description,
          capacity: room.capacity,
          price: room.price,
          mainImage,
          images,
          attributes,
        }
      }),
    )
    return {
      total: result.totalDocs,
      limit: result.limit,
      page: result.page,
      totalPages: result.totalPages,
      rooms,
    }
  }

  async updateRoom(roomId: string, body: UpdateRoomBodyDto, file?: File) {
    const room = await this.roomModel.findById(roomId)
    if (!room) {
      throw new BadRequestException(`Room with ID ${roomId} not found`)
    }
    if (body.name) room.name = body.name
    if (body.number) room.number = body.number
    if (body["room.type"]) room.roomType = body["room.type"]
    if (body.description) room.description = body.description
    if (body.capacity) room.capacity = body.capacity
    if (body.price) {
      room.price.value = body.price
    }
    if (body["price.currency"]) {
      room.price.currency = body["price.currency"]
    }
    if (body.attributeIds) {
      room.attributeIds = body.attributeIds
    }
    let mainImageId = room.mainImageId
    if (body["main.type"]) {
      if (body["main.type"] === "file" && file) {
        const media = await this.mediaService.createMedia({
          file,
          type: "file",
        })
        mainImageId = media._id.toString()
      } else if (body["main.type"] === "url" && body.location) {
        const media = await this.mediaService.createMedia({
          location: body.location,
          type: "url",
        })
        mainImageId = media._id.toString()
      } else {
        throw new BadRequestException(
          "No associated image for the provided main.type",
        )
      }
      room.mainImageId = mainImageId
    }
    await room.save()
    return {
      __v: room.__v,
      _id: room._id,
      name: room.name,
      number: room.number,
      description: room.description,
      capacity: room.capacity,
      price: room.price,
      mainImage: mainImageId
        ? await this.mediaService.getMediaInfo(mainImageId)
        : null,
      images: await Promise.all(
        room.imageIds.map((id) => this.mediaService.getMediaInfo(id)),
      ),
      attributes: await Promise.all(
        (room.attributeIds || []).map((id) =>
          this.attributeService.getAttribute(id),
        ),
      ),
    }
  }

  async deleteRoom(roomId: string): Promise<void> {
    const room = await this.roomModel.findById(roomId)
    if (!room) {
      throw new BadRequestException(`Room with ID ${roomId} not found`)
    }
    const imagesToDelete = new Set<string>()
    if (room.mainImageId) {
      imagesToDelete.add(room.mainImageId)
    }
    if (room.imageIds && room.imageIds.length > 0) {
      room.imageIds.forEach((id) => imagesToDelete.add(id))
    }
    for (const imageId of imagesToDelete) {
      await this.mediaService.deleteMedia(imageId)
    }
    await this.roomModel.findByIdAndDelete(roomId)
  }

  async createRoomImages(
    roomId: string,
    locations: string[],
    files: File[],
  ) {
    if ((!locations || locations.length === 0) && files.length === 0) {
      throw new BadRequestException("Must provide at least one image or location")
    }
    const room = await this.roomModel.findById(roomId)
    if (!room) {
      throw new BadRequestException(`Room with ID ${roomId} not found`)
    }
    const newImageIds: string[] = []
    if (files && files.length > 0) {
      for (const file of files) {
        const media = await this.mediaService.createMedia({
          file,
          type: "file",
        })
        newImageIds.push(media._id.toString())
      }
    }
    if (locations && locations.length > 0) {
      for (const location of locations) {
        const media = await this.mediaService.createMedia({
          location,
          type: "url",
        })
        newImageIds.push(media._id.toString())
      }
    }
    room.imageIds.push(...newImageIds)
    await room.save()
    const images = await Promise.all(
      room.imageIds.map((id) => this.mediaService.getMediaInfo(id)),
    )
    return {
      __v: room.__v,
      _id: room._id,
      name: room.name,
      number: room.number,
      description: room.description,
      capacity: room.capacity,
      price: room.price,
      mainImage: room.mainImageId
        ? await this.mediaService.getMediaInfo(room.mainImageId)
        : null,
      images,
      attributes: await Promise.all(
        (room.attributeIds || []).map((id) =>
          this.attributeService.getAttribute(id),
        ),
      ),
    }
  }

  async deleteRoomImages(roomId: string, imageIds: string[]) {
    const room = await this.roomModel.findById(roomId)
    if (!room) {
      throw new BadRequestException(`Room with ID ${roomId} not found`)
    }
    const imagesToDelete = new Set<string>(imageIds)
    const existingImageIds = new Set<string>(room.imageIds || [])
    for (const imageId of imagesToDelete) {
      if (!existingImageIds.has(imageId)) {
        throw new BadRequestException(
          `Image with ID ${imageId} not found in the room`,
        )
      }
    }
    for (const imageId of imagesToDelete) {
      await this.mediaService.deleteMedia(imageId)
    }
    room.imageIds = room.imageIds.filter((id) => !imagesToDelete.has(id))
    if (room.mainImageId && imagesToDelete.has(room.mainImageId)) {
      room.mainImageId = null
    }
    await room.save()
    const updatedImages = await Promise.all(
      room.imageIds.map((id) => this.mediaService.getMediaInfo(id)),
    )
    const mainImage = room.mainImageId
      ? await this.mediaService.getMediaInfo(room.mainImageId)
      : null
    return {
      __v: room.__v,
      _id: room._id,
      name: room.name,
      number: room.number,
      description: room.description,
      capacity: room.capacity,
      price: room.price,
      mainImage,
      images: updatedImages,
      attributes: await Promise.all(
        (room.attributeIds || []).map((id) =>
          this.attributeService.getAttribute(id),
        ),
      ),
    }
  }

  async updateRoomImages(roomId: string, locations: string[], files: File[]) {
    const room = await this.roomModel.findById(roomId)
    if (!room) {
      throw new BadRequestException(`Room with ID ${roomId} not found`)
    }
    const imagesToDelete = new Set<string>(room.imageIds)
    for (const imageId of imagesToDelete) {
      await this.mediaService.deleteMedia(imageId)
    }
    room.imageIds = []
    const newImageIds: string[] = []
    if (files && files.length > 0) {
      for (const file of files) {
        const media = await this.mediaService.createMedia({
          file,
          type: "file",
        })
        newImageIds.push(media._id.toString())
      }
    }
    if (locations && locations.length > 0) {
      for (const location of locations) {
        const media = await this.mediaService.createMedia({
          location,
          type: "url",
        })
        newImageIds.push(media._id.toString())
      }
    }
    room.imageIds = newImageIds
    await room.save()
    const images = await Promise.all(
      room.imageIds.map((id) => this.mediaService.getMediaInfo(id)),
    )
    return {
      __v: room.__v,
      _id: room._id,
      name: room.name,
      number: room.number,
      description: room.description,
      capacity: room.capacity,
      price: room.price,
      mainImage: room.mainImageId
        ? await this.mediaService.getMediaInfo(room.mainImageId)
        : null,
      images,
      attributes: await Promise.all(
        (room.attributeIds || []).map((id) =>
          this.attributeService.getAttribute(id),
        ),
      ),
    }
  }

  async addRoomAttribute(roomId: string, attributeId: string) {
    const room = await this.roomModel.findById(roomId)
    if (!room) {
      throw new BadRequestException(`Room with ID ${roomId} not found`)
    }
    if (room.attributeIds.includes(attributeId)) {
      throw new BadRequestException(`Attribute with ID ${attributeId} is already added to the room`)
    }
    room.attributeIds.push(attributeId)
    await room.save()
    const attributes = await Promise.all(
      room.attributeIds.map((id) => this.attributeService.getAttribute(id)),
    )
    return {
      __v: room.__v,
      _id: room._id,
      name: room.name,
      number: room.number,
      description: room.description,
      capacity: room.capacity,
      price: room.price,
      mainImage: room.mainImageId
        ? await this.mediaService.getMediaInfo(room.mainImageId)
        : null,
      images: await Promise.all(
        room.imageIds.map((id) => this.mediaService.getMediaInfo(id)),
      ),
      attributes,
    }
  }

  async removeRoomAttribute(roomId: string, attributeId: string) {
    const room = await this.roomModel.findById(roomId)
    if (!room) {
      throw new BadRequestException(`Room with ID ${roomId} not found`)
    }
    if (!room.attributeIds.includes(attributeId)) {
      throw new BadRequestException(`Attribute with ID ${attributeId} not found in the room`)
    }
    room.attributeIds = room.attributeIds.filter((id) => id !== attributeId)
    await room.save()
    const attributes = await Promise.all(
      room.attributeIds.map((id) => this.attributeService.getAttribute(id)),
    )
    return {
      __v: room.__v,
      _id: room._id,
      name: room.name,
      number: room.number,
      description: room.description,
      capacity: room.capacity,
      price: room.price,
      mainImage: room.mainImageId
        ? await this.mediaService.getMediaInfo(room.mainImageId)
        : null,
      images: await Promise.all(
        room.imageIds.map((id) => this.mediaService.getMediaInfo(id)),
      ),
      attributes,
    }
  }

  @OnEvent("attribute.deleted")
  async handleAttributeDeleted(attributeId: string) {
    await this.roomModel.updateMany(
      { attributeIds: attributeId },
      { $pull: { attributeIds: attributeId } },
    )
  }
}
