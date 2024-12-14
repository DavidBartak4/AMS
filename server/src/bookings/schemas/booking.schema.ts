import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, PaginateModel } from "mongoose"
import * as mongoosePaginate from "mongoose-paginate-v2"

class Owner {
  @Prop({ required: true })
  firstname: string

  @Prop({ required: true })
  lastname: string
}

@Schema({ timestamps: true })
export class Booking {
  @Prop({ unique: true, required: true })
  bookingCode: string

  @Prop({ type: Owner, required: true })
  owner: Owner

  @Prop({ required: true })
  roomId: string

  @Prop()
  email?: string

  @Prop({ required: true })
  checkIn: Date

  @Prop({ required: true })
  checkOut: Date

  @Prop({ required: true })
  phone: string
}

export type BookingDocument = Booking & Document
export const BookingSchema = SchemaFactory.createForClass(Booking)
export type BookingModel = PaginateModel<BookingDocument>
BookingSchema.plugin(mongoosePaginate)