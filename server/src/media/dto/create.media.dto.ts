import { IsString, IsUrl } from "class-validator"

export class CreateMediaByUrlBodyDto {
  @IsString()
  @IsUrl()
  url: string
}