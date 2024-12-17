import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { MediaModule } from "src/media/media.module"
import { AttributesModule } from "src/attributes/attributes.module"
import { RoomType, RoomTypeSchema } from "./schemas/room.type.schema"
import { RoomTypesController } from "./room.types.controller"
import { RoomsTypesService } from "./room.types.service"

@Module({
  imports: [
    MongooseModule.forFeature([{ name: RoomType.name, schema: RoomTypeSchema }]),
    MediaModule,
    AttributesModule
  ],
  controllers: [RoomTypesController],
  providers: [RoomsTypesService]
})
export class RoomTypesModule {}