import { IsDateString } from "class-validator"
import { IsCheckOutDate, IsCheckInDate } from "../decorators/bookings.decorators"

export class GetBookingConflictBodyDto {
  @IsDateString()
  @IsCheckInDate()
  checkIn?: Date

  @IsDateString()
  @IsCheckOutDate()
  checkOut?: Date
}