import { IsString, IsOptional, IsIn, ValidateIf, IsUrl, IsBoolean } from "class-validator"

export class CreateAttributeBodyDto {
  @IsString()
  name: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsIn(["url", "file"])
  type?: string
  
  @ValidateIf(function(obj) { return obj.type === "url" })
  @IsString()
  @IsUrl()
  location?: string
}