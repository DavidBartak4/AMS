import { IsString, IsMongoId } from "class-validator"

export class MediaParamsDto {
  @IsString()
  @IsMongoId()
  mediaId: string
}