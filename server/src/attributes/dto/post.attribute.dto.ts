import { IsString, IsOptional, MinLength, MaxLength } from "class-validator"

export class PostAttributeBodyDto {
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