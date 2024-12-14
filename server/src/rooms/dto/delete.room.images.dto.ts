import { IsMongoId, IsString } from "class-validator"

export class DeleteRoomImagesParamsDto {
  @IsString()
  @IsMongoId()
  roomId: string
}

export class  DeleteRoomImagesBodyDto {
  @IsString({ each: true })
  @IsMongoId({ each: true })
  imageIds: string[]
}