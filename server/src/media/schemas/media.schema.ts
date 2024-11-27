import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

export type MediaDocument = Media & Document

@Schema({ timestamps: true })
export class Media {
  @Prop({ required: true })
  filename: string

  @Prop({ required: true })
  mimeType: string

  @Prop({ required: true })
  size: number

  @Prop({ required: true })
  uploadDate: Date
}

export const MediaSchema = SchemaFactory.createForClass(Media)