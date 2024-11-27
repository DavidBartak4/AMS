import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

export type RoomDocument = Room & Document

class Price {
  @Prop({ required: true })
  value: number

  @Prop({ required: true })
  currency: string
}

@Schema({ timestamps: true })
export class Room {
  @Prop({ unique: true, required: true })
  _id: string

  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  capacity: number

  @Prop({ type: Price, required: true })
  price: Price

  @Prop({ type: [String], default: [] })
  images: string[]

  @Prop({ required: true })
  description: string

  @Prop({ type: [String], default: [] })
  attributes: string[]
}

export const RoomSchema = SchemaFactory.createForClass(Room)