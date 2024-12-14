import { Transform } from "class-transformer"
import { IsMongoId, IsOptional, IsString, IsUrl } from "class-validator"

export class CreateRoomImagesParamsDto {
  @IsString()
  @IsMongoId()
  roomId: string
}

export class CreateRoomImagesBodyDto {
  @IsOptional()
  @Transform(function (field) {
    const value = field.value
    return Array.isArray(value) ? value : [value]
  })
  @IsString({ each: true })
  @IsUrl({}, { each: true })
  location?: string[]
}