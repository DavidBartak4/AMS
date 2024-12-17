import { Type } from "class-transformer"
import {
  IsDateString,
  IsIn,
  IsOptional,
  Min,
  IsInt,
} from "class-validator"
import { IsCheckInDate, IsCheckOutDate } from "../decorators/bookings.decorators"

export class GetRoomsByAvailbilityQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsIn([10, 25, 50, 100])
  limit?: number = 10

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @IsInt()
  page?: number = 1
}

export class GetRoomsByAvailbilityBodyDto {    
    @IsDateString()
    @IsCheckInDate()
    checkIn: Date
  
    @IsDateString()
    @IsCheckOutDate()
    checkOut: Date

    
}