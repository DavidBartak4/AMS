import { IsString, IsMongoId } from "class-validator"

export class GetMediaParamsDto {
  @IsString()
  @IsMongoId()
  mediaId: string
}