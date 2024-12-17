import { Transform, Type } from "class-transformer"
import { IsString, IsUrl, ValidateIf, IsNumber, IsOptional, IsIn, IsMongoId } from "class-validator"

export class CreateRoomTypeBodyDto {
  @IsString()
  name: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @Type(function() { return Number })
  @IsNumber()
  capacity?: number

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

  @IsOptional()
  @Transform(function({ value }) {
    value = JSON.parse(value)
    return Array.isArray(value) ? value : [value]
  })
  @IsString({ each: true })
  @IsUrl({}, { each: true })
  locations?: string[]

  @IsOptional()
  @Transform(function({ value }) {
    value = JSON.parse(value)
    return Array.isArray(value) ? value : [value]
  })
  @IsString({ each: true })
  @IsMongoId({ each: true })
  attributeIds?: string[]

  @IsOptional()
  @Transform(function(field) {
    const value = field.value
    return Array.isArray(value) ? value : [value]
  })
  @IsString({ each: true })
  @IsMongoId({ each: true })
  attributeId?: string[]
}