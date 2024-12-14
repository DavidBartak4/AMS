import { IsDateString, IsMongoId, IsString } from "class-validator"
import { IsCheckOutDate, IsCheckInDate } from "../decorators/bookings.decorators"

export class GetBookingConflictBodyDto {
  @IsString()
  @IsMongoId()
  roomId: string
  
  @IsDateString()
  @IsCheckInDate()
  checkIn?: Date

  @IsDateString()
  @IsCheckOutDate()
  checkOut?: Date
}