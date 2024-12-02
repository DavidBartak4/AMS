import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { RoomsService } from "./rooms.service"
import { RoomSchema, Room } from "./schemas/room.schema"
import { RoomsController } from "./rooms.controller"
import { MediaModule } from "src/media/media.module"

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
    MediaModule
  ],
  controllers: [RoomsController],
  providers: [RoomsService]
})
export class RoomsModule {}