import { NotFoundException, Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { Room, RoomDocument } from "./schemas/room.schema"
import { MediaService } from "src/media/media.service"
import { PostRoomBodyDto } from "./dto/post.room.dto"
import { PatchRoomBodyDto } from "./dto/patch.room.dto"

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name) private readonly roomModel: Model<RoomDocument>,
    private readonly mediaService: MediaService,
  ) {}

  private async validateMediaIds(images: string[]) {
    for (const mediaId of images) {
      const exists = await this.mediaService.doesMediaExist(mediaId)
      if (!exists) {
        throw new NotFoundException(`Media with ID ${mediaId} does not exist`)
      }
    }
  }

  async createRoom(dto: PostRoomBodyDto) {
    if (dto.images && dto.images.length > 0) {
      await this.validateMediaIds(dto.images)
    }
    return await this.roomModel.create(dto)
  }

  async getRooms() {
    return this.roomModel.find().exec()
  }

  async getRoom(roomId: string) {
    const room = await this.roomModel.findById(roomId).exec()
    if (!room) {
      throw new NotFoundException(`Room with ID ${roomId} not found`)
    }
    return room
  }

  async patchRoom(roomId: string, dto: PatchRoomBodyDto) {
    if (dto.images && dto.images.length > 0) {
      await this.validateMediaIds(dto.images)
    }
    const room = await this.roomModel.findById(roomId).exec()
    if (!room) {
      throw new NotFoundException(`Room with ID ${roomId} not found`)
    }
    Object.assign(room, dto)
    return room.save()
  }

  async deleteRoom(roomId: string) {
    const result = await this.roomModel.findByIdAndDelete(roomId).exec()
    if (!result) {
      throw new NotFoundException(`Room with ID ${roomId} not found`)
    }
  }
}