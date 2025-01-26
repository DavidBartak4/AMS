import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { MediaModule } from "src/media/media.module"
import { Room, RoomSchema } from "./schemas/room.schema"
import { RoomsController } from "./rooms.controller"
import { RoomsService } from "./rooms.service"
import { AttributesModule } from "src/attributes/attributes.module"

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
    MediaModule,
    AttributesModule
  ],
  controllers: [RoomsController],
  providers: [RoomsService],
  exports: [RoomsService]
})

export class RoomsModule {}