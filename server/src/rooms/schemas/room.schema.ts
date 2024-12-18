import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, PaginateModel } from "mongoose"
import * as mongoosePaginate from "mongoose-paginate-v2"

@Schema({ _id: false })
export class Price {
  @Prop({ required: true, min: 0 })
  value: number

  @Prop({ required: true })
  currency: string
}

@Schema({ timestamps: true })
export class Room {
  @Prop({ required: true, minlength: 1, maxlength: 50 })
  name: string

  @Prop()
  number?: number

  @Prop({ type: String })
  roomType?: string

  @Prop({ maxlength: 1000 })
  description?: string

  @Prop()
  mainImageId?: string

  @Prop()
  imageIds?: string[]

  @Prop({ min: 0 })
  capacity?: number

  @Prop({ type: Price })
  price?: Price

  @Prop()
  attributeIds?: string[]
}

export type RoomDocument = Room & Document
export const RoomSchema = SchemaFactory.createForClass(Room)
export type RoomModel = PaginateModel<RoomDocument>
RoomSchema.plugin(mongoosePaginate)