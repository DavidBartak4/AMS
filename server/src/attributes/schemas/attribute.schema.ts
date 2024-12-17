import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, PaginateModel } from "mongoose"
import * as mongoosePaginate from "mongoose-paginate-v2"

@Schema({ timestamps: true })
export class Attribute {
  @Prop({ type: String, required: true })
  name: string

  @Prop({ type: String })
  description?: string

  @Prop({ type: String })
  imageId?: string
}

export type AttributeDocument = Attribute & Document
export const AttributeSchema = SchemaFactory.createForClass(Attribute)
export type AttributeModel = PaginateModel<AttributeDocument>
AttributeSchema.plugin(mongoosePaginate)