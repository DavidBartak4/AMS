import { Type } from "class-transformer"
import { IsBoolean, IsDateString, IsEmail, IsMongoId, IsOptional, IsPhoneNumber, IsString, MaxLength, MinLength, ValidateNested } from "class-validator"
import { IsCheckOutDate, IsCheckInDate } from "../decorators/bookings.decorators"

class Owner {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  firstname: string

  @IsString()
  @MinLength(1)
  @MaxLength(50)
  lastname: string
}

export class CreateBookingBodyDto {
  @IsString()
  @IsMongoId()
  roomId: string

  @IsOptional()
  @IsEmail()
  email?: string

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

  @IsOptional()
  @IsBoolean()
  confirmation?: boolean
}