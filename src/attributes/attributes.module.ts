import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { Attribute, AttributeSchema } from "./schemas/AttributeSchema"
import { AttributesController } from "./attributes.controller"
import { AttributesService } from "./attribute.service"
import { MediaModule } from "src/media/media.module"

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Attribute.name, schema: AttributeSchema }]),
    MediaModule
  ],
  controllers: [AttributesController],
  providers: [AttributesService],
  exports: [AttributesService]
})

export class AttributesModule {}