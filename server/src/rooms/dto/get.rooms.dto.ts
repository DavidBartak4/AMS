import { IsOptional, IsIn, Min, IsNumber, MinLength, MaxLength, IsString, ValidateNested } from "class-validator"
import { IsCurrencyCode } from "src/common/decorators/currencyCode.dectorator"
import { Type } from "class-transformer"
import { IsRange } from "src/common/decorators/range.decorator"

class Price {
  @IsOptional()
  @IsNumber()
  value?: number

  @IsOptional()
  @IsRange("min", "max")
  range?: any

  @IsOptional()
  @IsString()
  @IsCurrencyCode()
  currency?: string
}

export class GetRoomsQueryDto {
  @IsOptional()
  @Type(function() { return Number })
  @IsIn([10, 25, 50, 100])
  limit?: number = 10

  @IsOptional()
  @Type(function() { return Number })
  @Min(1)
  page?: number
}

export class GetRoomsBodyDto {
  @IsOptional()
  @MinLength(1)
  @MaxLength(50)
  name?: string

  @IsOptional()
  @IsNumber()
  number?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  capacity?: number

  @IsOptional()
  @ValidateNested()
  @Type(function() { return Price })
  price?: Price
}