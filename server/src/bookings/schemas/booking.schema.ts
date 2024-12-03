import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

export type BookingDocument = Booking & Document

@Schema({ timestamps: true })
export class Booking {
    @Prop({ unique: true, required: true })
    bookingCode: string
    
    @Prop({ required: true })
    roomId: string
    
    @Prop({ required: true })
    email: string
    
    @Prop({ required: true })
    checkIn: Date
    
    @Prop({ required: true })
    checkOut: Date
    
    @Prop({ required: true })
    phone: string
    
    @Prop({ required: true })
    address: string
    
    @Prop({ required: true })
    identityNumber: string
}

export const BookingSchema = SchemaFactory.createForClass(Booking)