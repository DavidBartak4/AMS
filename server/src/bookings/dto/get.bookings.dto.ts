import { Type } from "class-transformer"
import {
  IsDateString,
  IsEmail,
  IsIn,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from "class-validator"
import { IsDateRange } from "src/common/decorators/range.date.decorator"

export class GetBookingsQueryDto {
  @IsOptional()
  @Type(function () {
    return Number
  })
  @IsIn([10, 25, 50, 100])
  limit?: number = 10

  @IsOptional()
  @Type(function () {
    return Number
  })
  @Min(1)
  page?: number = 1
}

class DateRange {
  @IsDateString()
  @Type(() => Date)
  min: Date

  @IsDateString()
  @Type(() => Date)
  max: Date
}

export class GetBookingsBodyDto {
  @IsOptional()
  @IsString()
  @IsMongoId()
  roomId?: string

  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @IsDateString()
  checkIn?: Date

  @IsOptional()
  @IsDateString()
  checkOut?: Date

  @IsOptional()
  @IsNumber()
  bookingDurationInDays?: number

  @IsOptional()
  @ValidateNested()
  @Type(() => Date)
  @IsDateRange()
  dateRange?: DateRange

  @IsOptional()
  @IsString()
  @IsUUID("4")
  bookingCode?: string
}
