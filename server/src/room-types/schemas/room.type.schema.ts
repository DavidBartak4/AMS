import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, PaginateModel, Types } from "mongoose"
import * as mongoosePaginate from "mongoose-paginate-v2"

@Schema({ timestamps: true })
export class RoomType {
  _id: Types.ObjectId

  @Prop({ type: String, unique: true, required: true })
  name: string

  @Prop({ type: String })
  description?: string

  @Prop({ type: Number })
  capacity?: number

  @Prop({ type: String })
  mainImageId?: string

  @Prop({ type: [String] })
  imageIds?: string[]

  @Prop({ type: [String] })
  attributeIds?: string[]
}

export type RoomTypeDocument = RoomType & Document
export const RoomTypeSchema = SchemaFactory.createForClass(RoomType)
export type RoomTypeModel = PaginateModel<RoomTypeDocument>
RoomTypeSchema.plugin(mongoosePaginate)