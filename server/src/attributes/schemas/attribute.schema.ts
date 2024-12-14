import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, PaginateModel } from "mongoose"
import * as mongoosePaginate from "mongoose-paginate-v2"

@Schema({ timestamps: true })
export class Attribute {
  @Prop({ required: true, minlength: 1, maxlength: 50 })
  name: string

  @Prop({ maxlength: 1000 })
  description?: string

  @Prop()
  imageId?: string
}

export type AttributeDocument = Attribute & Document
export const AttributeSchema = SchemaFactory.createForClass(Attribute)
export type AttributeModel = PaginateModel<AttributeDocument>
AttributeSchema.plugin(mongoosePaginate)