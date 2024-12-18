import { Transform, Type } from "class-transformer"
import { IsString, IsUrl, ValidateIf, IsNumber, IsOptional, IsIn, IsMongoId, Min, IsBoolean } from "class-validator"

export class UpdateRoomTypeParamsDto {
  @IsString()
  @IsMongoId()
  roomTypeId: string
}

export class UpdateRoomTypeBodyDto {
  @IsOptional()  
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @Type(function() { return Number })
  @IsNumber()
  @Min(0)
  capacity?: number

  @IsOptional()
  @IsIn(["url", "file"])
  ["main.type"]?: string

  @ValidateIf(function(obj) { return obj["main.type"] === "url" })
  @IsString()
  @IsUrl()
  ["main.location"]?: string

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