import { IsString, IsEmail, IsDateString, IsOptional } from "class-validator"
import { IsMinDateToday, IsCheckOutDate, IsValidAddress } from "../decorators/bookings.decorators"

export class PostBookingBodyDto {
    @IsOptional()
    @IsString()
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
    @IsCheckOutDate({ message: "Check-out date must be 1 to 60 nights after check-in." })
    checkOut?: Date
  
    @IsOptional()
    @IsString()
    phone?: string
  
    @IsOptional()
    @IsString()
    @IsValidAddress({ message: "Address must be real and valid." })
    address?: string
  
    @IsOptional()
    @IsString()
    identityNumber?: string
}