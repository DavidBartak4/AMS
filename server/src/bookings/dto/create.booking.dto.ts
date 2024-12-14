import { Type } from "class-transformer"
import { IsDateString, IsEmail, IsMongoId, IsPhoneNumber, IsString, ValidateNested } from "class-validator"
import { IsCheckOutDate, IsCheckInDate } from "../decorators/bookings.decorators"

class Owner {
  @IsString()
  firstname: string

  @IsString()
  lastname: string
}

export class CreateBookingBodyDto {
  @IsString()
  @IsString()
  @IsMongoId()
  roomId: string

  @IsEmail()
  email: string

  @IsDateString()
  @IsCheckInDate()
  checkIn: Date

  @IsDateString()
  @IsCheckOutDate()
  checkOut: Date

  @IsString()
  @IsPhoneNumber(null)
  phone: string

  @ValidateNested()
  @Type(function() { return Owner })
  owner: Owner
}