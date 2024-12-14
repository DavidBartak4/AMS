import { Transform, Type } from "class-transformer"
import { IsIn, isMongoId, IsMongoId, IsNumber, IsOptional, IsString, IsUrl, ValidateIf } from "class-validator"

export class AddImagesToRoomParamsDto {
  @IsString()
  @IsMongoId()
  roomId: string
}

export class AddImagesToRoomBodyDto {
  @IsOptional()
  @IsIn(["url", "file"])
  ["main.type"]: string

  @ValidateIf(function (obj) {
    return obj.mainType
  })
  @Type(function () {
    return Number
  })
  @IsNumber()
  ["main.index"]: number

  @IsOptional()
  @Transform(function (field) {
    const value = field.value
    return Array.isArray(value) ? value : [value]
  })
  @IsString({ each: true })
  @IsUrl({}, { each: true })
  location?: string[]
}
