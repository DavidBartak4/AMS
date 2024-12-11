import { IsString, IsOptional, MinLength, MaxLength, IsMongoId } from "class-validator"

export class PatchAttributeParamsDto {
  @IsString()
  @IsMongoId()
  attributeId: string
}

export class PatchAttributeBodyDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  name?: string

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string
}