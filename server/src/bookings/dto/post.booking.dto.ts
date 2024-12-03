import {
  IsString,
  IsEmail,
  IsDateString,
  ValidateNested,
  IsPhoneNumber,
  IsMongoId,
} from "class-validator"
import { Type } from "class-transformer"
import {
  IsMinDateToday,
  IsCheckOutDate,
} from "../decorators/bookings.decorators"

class OwnerDto {
  @IsString()
  firstname: string

  @IsString()
  lastname: string
}

export class PostBookingBodyDto {
  @IsString()
  @IsMongoId()
  roomId: string

  @IsEmail()
  email: string

  @IsDateString()
  @IsMinDateToday({ message: "Check-in date must be today or in the future." })
  checkIn: Date

  @IsDateString()
  @IsCheckOutDate({
    message: "Check-out date must be 1 to 60 nights after check-in.",
  })
  checkOut: Date

  @IsString()
  @IsPhoneNumber(null)
  phone: string

  @ValidateNested()
  @Type(() => OwnerDto)
  owner: OwnerDto
}