import { IsString, MinLength, MaxLength, IsOptional, IsArray, IsNumber, IsMongoId, ValidateNested, Min } from "class-validator"
import { Type } from "class-transformer"
import { IsCurrencyCode } from "src/common/decorators/currencyCode.dectorator"

class PriceDto {
  @IsNumber()
  value: number

  @IsString()
  @IsCurrencyCode()
  currency: string
}

export class CreatetRoomBodyDto {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  name: string

  @IsOptional()
  @IsNumber()
  number: number

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  description: string

  @IsNumber()
  @Min(0)
  capacity: number

  @ValidateNested()
  @Type(function () { return PriceDto })
  price: PriceDto
}