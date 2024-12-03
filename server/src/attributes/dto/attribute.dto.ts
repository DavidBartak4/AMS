import {
  IsString,
  IsMongoId,
  IsOptional,
  MinLength,
  MaxLength,
} from "class-validator"

export class AttributeParamsDto {
  @IsString()
  @IsMongoId()
  attributeId: string
}

export class AttributeBodyDto {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  name: string

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string

  @IsOptional()
  @IsString()
  @IsMongoId()
  imageId?: string
}