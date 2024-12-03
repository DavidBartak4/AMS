import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

export type RoomDocument = Room & Document

@Schema({ _id: false })
export class Price {
  @Prop()
  value?: number

  @Prop()
  currency?: string
}

@Schema({ timestamps: true })
export class Room {
  @Prop({ required: true, minlength: 1, maxlength: 50 })
  name: string

  @Prop({ maxlength: 1000 })
  description: string

  @Prop()
  images: [string]

  @Prop()
  capacity: number

  @Prop({ type: Price })
  price: Price
}

export const RoomSchema = SchemaFactory.createForClass(Room)