import { Type } from "class-transformer"
import { IsOptional, IsString, IsInt, ValidateNested, IsBoolean } from "class-validator"

class Mail {
  @IsOptional()
  @IsString()
  host?: string

  @IsOptional()
  @IsInt()
  port?: number

  @IsOptional()
  @IsString()
  username?: string

  @IsOptional()
  @IsString()
  password?: string

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
  companyName?: string
}