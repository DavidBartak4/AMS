import { Type } from "class-transformer"
import { IsOptional, IsString, IsInt, ValidateNested, IsBoolean } from "class-validator"

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

export class UpdateConfigurationBodyDto {
  @IsOptional()
  @ValidateNested()
  @Type(function() { return Mail })
  mail?: Mail

  @IsOptional()
  @IsString()
  companyName?: string
}