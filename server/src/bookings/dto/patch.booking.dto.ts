import {
  IsString,
  IsEmail,
  IsDateString,
  IsOptional,
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
  @IsOptional()
  @IsString()
  firstname?: string

  @IsOptional()
  @IsString()
  lastname?: string
}

export class PatchBookingBodyDto {
  @IsOptional()
  @IsString()
  @IsMongoId()
  roomId?: string

  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @IsDateString()
  @IsMinDateToday({ message: "Check-in date must be today or in the future." })
  checkIn?: Date

  @IsOptional()
  @IsDateString()
  @IsCheckOutDate({
    message: "Check-out date must be 1 to 60 nights after check-in.",
  })
  checkOut?: Date

  @IsOptional()
  @IsString()
  @IsPhoneNumber(null)
  phone?: string

  @IsOptional()
  @ValidateNested()
  @Type(() => OwnerDto)
  owner?: OwnerDto
}