import { Type } from "class-transformer"
import { IsOptional, IsString, IsInt, ValidateNested, MinLength, MaxLength, IsBoolean } from "class-validator"

class Mail {
  @IsOptional()
  @IsString()
  mailHost?: string

  @IsOptional()
  @IsInt()
  mailPort?: number

  @IsOptional()
  @IsString()
  mailUsername?: string

  @IsOptional()
  @IsString()
  mailPassword?: string

  @IsOptional()
  @IsBoolean()
  useCompanyName?: boolean
}

export class CreateConfigurationBodyDto {
  @IsOptional()
  @ValidateNested()
  @Type(function() { return Mail })
  mail?: Mail

  @IsOptional()
  @IsString()
  //@MinLength(1)
  //@MaxLength(100)
  companyName?: string
}