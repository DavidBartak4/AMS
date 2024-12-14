import { Transform, Type } from "class-transformer"
import { IsString, MinLength, MaxLength, IsOptional, IsNumber, IsIn, Min, IsUrl, ValidateIf, IsMongoId } from "class-validator"
import { IsCurrencyCode } from "src/common/decorators/currencyCode.dectorator"

export class CreatetRoomBodyDto {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  name: string

  @IsOptional()
  @Type(function() { return Number })
  @IsNumber()
  number?: number

  @IsOptional()
  @IsString()
  @IsIn(["SINGLE_ROOM", "DOUBLE_ROOM", "DOUBLE_ROOM_DELUXE", "TRIPLE_ROOM_DELUXE"])
  ["room.type"]?: string  

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  description?: string

  @Type(function() { return Number })
  @IsNumber()
  @Min(0)
  capacity: number

  @IsOptional()
  @Transform(function(field) {
    const value = field.value
    return Array.isArray(value) ? value : [value]
  })
  @IsString({ each: true })
  @IsMongoId({ each: true })
  attributeIds?: string[]

  @Type(function() { return Number })
  @IsNumber()
  @Min(0)
  price: number

  @IsString()
  @IsCurrencyCode()
  ["price.currency"]: string

  @IsOptional()
  @IsIn(["url", "file"])
  ["main.type"]?: string

  @ValidateIf(function(obj) { return obj.mainType})
  @Type(function() { return Number })
  @IsNumber()
  ["main.index"]: number

  @IsOptional()
  @Transform(function(field) {
    const value = field.value
    return Array.isArray(value) ? value : [value]
  })
  @IsString({ each: true })
  @IsUrl({}, { each: true })
  location?: string[]
}