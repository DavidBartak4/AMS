import { IsString, IsMongoId } from "class-validator"

export class MediaParamsDto {
  @IsMongoId()
  @IsString()
  mediaId: string
}