import { IsString, IsEmail, IsDateString } from "class-validator"
import { IsMinDateToday, IsCheckOutDate, IsValidAddress } from "../decorators/bookings.decorators"

export class PostBookingBodyDto {
    @IsString()
    roomId: string
  
    @IsEmail()
    email: string
  
    @IsDateString()
    @IsMinDateToday({ message: "Check-in date must be today or in the future." })
    checkIn: Date
  
    @IsDateString()
    @IsCheckOutDate({ message: "Check-out date must be 1 to 60 nights after check-in." })
    checkOut: Date
  
    @IsString()
    phone: string
  
    @IsString()
    @IsValidAddress({ message: "Address must be real and valid." })
    address: string
  
    @IsString()
    identityNumber: string
}