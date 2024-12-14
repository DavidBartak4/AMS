import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { RoomsService } from "./rooms.service"
import { RoomSchema, Room } from "./schemas/room.schema"
import { RoomsController } from "./rooms.controller"
import { MediaModule } from "src/media/media.module"
import { AttributesModule } from "src/attributes/attributes.module"

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
    MediaModule,
    AttributesModule
  ],
  controllers: [RoomsController],
  providers: [RoomsService],
  exports: [RoomsService],
})
export class RoomsModule {}