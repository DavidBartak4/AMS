import { BadRequestException, Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Room } from "./schemas/room.schema"
import { MediaService } from "src/media/media.service"
import { CreatetRoomBodyDto } from "./dto/create.room.dto"
import { RoomModel } from "./schemas/room.schema"
import { GetRoomsBodyDto, GetRoomsQueryDto } from "./dto/get.rooms.dto"
import { AttributesService } from "src/attributes/attributes.service"
import { OnEvent } from "@nestjs/event-emitter"

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name) private readonly roomModel: RoomModel, 
    private readonly mediaService: MediaService, 
    private readonly attributeService: AttributesService, 
  ) {}

  async createRoom(body: CreatetRoomBodyDto, files: File[]) {
    let mainImageId
    if (body["main.type"]) {
      const file = files[body["main.index"]]
      const location = body.location[body["main.index"]]
      if ((body["main.type"] === "file" && !file) || (body["main.type"] === "url" && !location)) {
        throw new BadRequestException("No associated image for provided main.index")
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
        const media = await this.mediaService.createMedia({ file, type: "file" })
        imageIds.push(media._id)
      }
    }
    for (const [index, location] of body.location.entries()) {
      if (body["main.type"] !== "url" || body["main.index"] !== index) {
        const media = await this.mediaService.createMedia({ location: location, type: "url" })
        imageIds.push(media._id)
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
    const attributes = await Promise.all(body.attributeIds.map((id) => this.attributeService.getAttribute(id)))
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
    if (!room) { throw new BadRequestException(`Room with ID ${roomId} not found`) }
    const mainImage = room.mainImageId
      ? await this.mediaService.getMediaInfo(room.mainImageId)
      : null
    const images = await Promise.all(room.imageIds.map((id) => this.mediaService.getMediaInfo(id)))
    const attributes = await Promise.all(room.attributeIds.map((id) => this.attributeService.getAttribute(id)))
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

  @OnEvent("attribute.deleted")
  async handleAttributeDeleted(attributeId: string) {
    console.log(attributeId)
    /*
    await this.roomModel.updateMany(
      { attributeIds: attributeId },
      { $pull: { attributeIds: attributeId } }
    )
    */
  }

  async getRooms(body: GetRoomsBodyDto, query: GetRoomsQueryDto) {

  }
}