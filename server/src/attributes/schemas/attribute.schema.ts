import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

export type AttributeDocument = Attribute & Document

@Schema({ timestamps: true })
export class Attribute {
  @Prop({ required: true, minlength: 1, maxlength: 50 })
  name: string

  @Prop({ maxlength: 1000 })
  description: string

  @Prop()
  imageId: string
}

export const AttributeSchema = SchemaFactory.createForClass(Attribute)