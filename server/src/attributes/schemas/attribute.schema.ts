import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

export type AttributeDocument = Attribute & Document

@Schema({ timestamps: true })
export class Attribute {
  @Prop({ required: true })
  _id: string

  @Prop({ required: true, unique: true })
  name: string

  @Prop({ required: true })
  description: string

  @Prop()
  mediaId: string
}

export const AttributeSchema = SchemaFactory.createForClass(Attribute)