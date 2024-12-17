import { Type } from "class-transformer"
import {
  IsDateString,
  IsEmail,
  IsIn,
  IsInt,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested
} from "class-validator"
import { IsDateRange } from "src/common/decorators/range.date.decorator"

export class GetBookingsQueryDto {
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

class DateRange {
  @IsDateString()
  min: Date

  @IsDateString()
  max: Date
}

class DurationCondition {
  @IsOptional()
  @IsIn([">", "<", ">=", "<="])
  operator?: string

  @IsNumber()
  @Type(() => Number)
  duration: number
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
  @ValidateNested()
  @Type(() => DurationCondition)
  bookingDurationInDays?: DurationCondition

  @IsOptional()
  @ValidateNested()
  @Type(() => DateRange)
  @IsDateRange()
  bookingDateRange?: DateRange

  @IsOptional()
  @IsString()
  @IsUUID("4")
  bookingCode?: string
}