import { IsString, IsOptional, IsBoolean, IsIn, ValidateIf, IsUrl } from "class-validator"

export class UpdateAttributeBodyDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsIn(["url", "file"])
  type: string
  
  @ValidateIf(function(obj) { return obj.type === "url" })
  @IsString()
  @IsUrl()
  location?: string
}