import { IsString, MinLength, MaxLength, IsOptional, IsArray, IsNumber, IsMongoId, ValidateNested, IsCurrency } from "class-validator"
import { Type } from "class-transformer"
import { IsCurrencyCode } from "src/common/decorators/currencyCode.dectorator"

class PriceDto {
  @IsOptional()
  @IsNumber()
  value?: number

  @IsOptional()
  @IsString()
  @IsCurrencyCode()
  currency?: string
}

export class PatchRoomBodyDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  name: string

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  description: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsMongoId({ each: true})
  images?: string[]

  @IsOptional()
  @IsNumber()
  capacity?: number

  @IsOptional()
  @ValidateNested()
  @Type(function() {return PriceDto})
  price?: PriceDto
}