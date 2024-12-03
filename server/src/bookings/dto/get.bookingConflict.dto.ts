import { IsDateString } from "class-validator"
import {
  IsMinDateToday,
  IsCheckOutDate,
} from "../decorators/bookings.decorators"

export class GetBookingConflictBodyDto {
  @IsDateString()
  @IsMinDateToday({ message: "Check-in date must be today or in the future." })
  checkIn?: Date

  @IsDateString()
  @IsCheckOutDate({
    message: "Check-out date must be 1 to 60 nights after check-in.",
  })
  checkOut?: Date
}