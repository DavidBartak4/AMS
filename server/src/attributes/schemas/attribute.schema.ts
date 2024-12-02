import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

export type AttributeDocument = Attribute & Document

@Schema({ timestamps: true })
export class Attribute {
  @Prop({ required: true })
  name: string

  @Prop()
  description: string

  @Prop()
  imageId: string
}

export const AttributeSchema = SchemaFactory.createForClass(Attribute)