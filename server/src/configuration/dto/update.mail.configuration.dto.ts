import { IsOptional, IsString, IsInt, IsNotEmpty } from "class-validator"

export class UpdateMailConfigurationBodyDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  mailHost?: string

  @IsOptional()
  @IsInt()
  mailPort?: number

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  mailUsername?: string

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  mailPassword?: string
}