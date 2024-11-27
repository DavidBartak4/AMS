import { IsString, IsMongoId, IsOptional } from "class-validator"

export class AttributeParamsDto {
  @IsMongoId()
  @IsString()
  attributeId: string
}

export class AttributeBodyDto {
  @IsString()
  name: string

  @IsString()
  description: string

  @IsOptional()
  @IsMongoId()
  @IsString()
  imageId?: string
}