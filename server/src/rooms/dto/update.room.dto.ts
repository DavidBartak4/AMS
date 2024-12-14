import { Prop } from "@nestjs/mongoose"
import { Transform, Type} from "class-transformer"
import {
  IsIn,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  MinLength,
  ValidateIf
} from "class-validator"
import { IsCurrencyCode } from "src/common/decorators/currency.codes.decorator"

export class UpdateRoomParamsDto {
  @Prop()
  @IsString()
  @IsMongoId()
  roomId: string
}

export class UpdateRoomBodyDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  name?: string

  @IsOptional()
  @Type(function () {
    return Number
  })
  @IsNumber()
  number?: number

  @IsOptional()
  @IsString()
  @IsIn([
    "SINGLE_ROOM",
    "DOUBLE_ROOM",
    "DOUBLE_ROOM_DELUXE",
    "TRIPLE_ROOM_DELUXE",
  ])
  ["room.type"]?: string

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  description?: string

  @IsOptional()
  @Type(function () { return Number })
  @IsNumber()
  @Min(0)
  capacity?: number

  @IsOptional()
  @Transform(function (field) {
    const value = field.value
    return Array.isArray(value) ? value : [value]
  })
  @IsString({ each: true })
  @IsMongoId({ each: true })
  attributeIds?: string[]

  @IsOptional()
  @Type(function () {
    return Number
  })
  @IsNumber()
  @Min(0)
  price?: number

  @IsOptional()
  @IsString()
  @IsCurrencyCode()
  ["price.currency"]?: string

  @IsOptional()
  @IsIn(["url", "file"])
  ["main.type"]?: string

  @ValidateIf(function(obj) { return obj.type === "url" })
  @IsString()
  @IsUrl()
  location: string
}