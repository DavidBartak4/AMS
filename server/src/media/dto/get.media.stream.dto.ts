import { IsString, IsMongoId } from "class-validator"

export class GetMediaStreamParamsDto {
  @IsString()
  @IsMongoId()
  mediaId: string
}