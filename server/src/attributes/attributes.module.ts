import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { Attribute, AttributeSchema } from "./schemas/attribute.schema"
import { AttributesService } from "./attributes.service"
import { AttributesController } from "./attributes.controller"
import { MediaModule } from "src/media/media.module"

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Attribute.name, schema: AttributeSchema }]),
    MediaModule,
  ],
  controllers: [AttributesController],
  providers: [AttributesService],
})
export class AttributesModule {}