import { IsString, MinLength, MaxLength, IsOptional } from "class-validator"

export class UpdateUserCredentialsBodyDto {
  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(200)
  password?: string
}