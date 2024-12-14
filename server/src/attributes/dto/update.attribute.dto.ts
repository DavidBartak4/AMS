import { IsString, IsOptional, MinLength, MaxLength, IsIn, ValidateIf, IsUrl } from "class-validator"

export class UpdateAttributeBodyDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  name?: string

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string

  @IsOptional()
  @IsIn(["url", "file"])
  type: string
  
  @ValidateIf(function(obj) { return obj.type === "url" })
  @IsString()
  @IsUrl()
  location: string
}