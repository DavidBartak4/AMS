import { NotFoundException, Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { Room, RoomDocument } from "./schemas/room.schema"
import { MediaService } from "src/media/media.service"
import { CreatetRoomBodyDto } from "./dto/create.room.dto"

@Injectable()
export class RoomsService {
  constructor(@InjectModel(Room.name) private readonly roomModel: Model<RoomDocument>, private readonly mediaService: MediaService) {}

  async createRoom(body: CreatetRoomBodyDto) {}
  
}