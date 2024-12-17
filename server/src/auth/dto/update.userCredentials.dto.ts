import { IsString, IsOptional } from "class-validator"

export class UpdateUserCredentialsBodyDto {
  @IsOptional()
  @IsString()
  username?: string
  
  @IsOptional()
  @IsString()
  password?: string
}