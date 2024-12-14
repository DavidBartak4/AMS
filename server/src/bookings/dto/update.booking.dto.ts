import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsMongoId,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from "class-validator"
import {
  IsCheckInDate,
  IsCheckOutDate,
} from "../decorators/bookings.decorators"
import { Type } from "class-transformer"

export class UpdateBookingParamsDto {
  @IsString()
  @IsMongoId()
  bookingId: string
}

class Owner {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  firstname?: string

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  lastname?: string
}

export class UpdateBookingBodyDto {
  @IsString()
  @IsMongoId()
  roomId: string

  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @IsDateString()
  @IsCheckInDate()
  checkIn?: Date

  @IsOptional()
  @IsDateString()
  @IsCheckOutDate()
  checkOut?: Date

  @IsOptional()
  @IsString()
  @IsPhoneNumber(null)
  phone?: string

  @IsOptional()
  @ValidateNested()
  @Type(function () {
    return Owner
  })
  owner?: Owner

  @IsOptional()
  @IsBoolean()
  sendBookingConfirmation?: boolean
}