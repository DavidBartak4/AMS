import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { BookingSchema, Booking } from "./schemas/booking.schema"
import { BookingsController } from "./bookings.controller"
import { BookingService } from "./bookings.service"
import { ConfigurationModule } from "src/configuration/configuration.module"
import { RoomsModule } from "src/rooms/rooms.module"

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    ConfigurationModule,
    RoomsModule,
  ],
  controllers: [BookingsController],
  providers: [BookingService],
})
export class BookingModule {}