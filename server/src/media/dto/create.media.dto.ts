import { IsUrl, IsString, IsIn, ValidateIf } from "class-validator"

export class CreateMediaBodyDto {
  @IsIn(["url", "file"])
  type: string

  @ValidateIf(function(obj) { return obj.type === "url" })
  @IsString()
  @IsUrl()
  url: string
}