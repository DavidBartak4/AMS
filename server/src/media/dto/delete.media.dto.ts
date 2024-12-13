import { IsString, IsMongoId } from "class-validator"

export class DeleteMediaParamsDto {
  @IsString()
  @IsMongoId()
  mediaId: string
}