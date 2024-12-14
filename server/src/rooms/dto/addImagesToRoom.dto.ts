import { Transform, Type } from "class-transformer"
import { IsIn, isMongoId, IsMongoId, IsNumber, IsOptional, IsString, IsUrl, ValidateIf } from "class-validator"

export class AddImagesToRoomParamsDto {
  @IsString()
  @IsMongoId()
  roomId: string
}

export class AddImagesToRoomBodyDto {
  @IsOptional()
  @Transform(function (field) {
    const value = field.value
    return Array.isArray(value) ? value : [value]
  })
  @IsString({ each: true })
  @IsUrl({}, { each: true })
  location?: string[]
}