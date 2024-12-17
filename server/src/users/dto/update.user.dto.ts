import { IsString, IsOptional } from "class-validator"

export class UpdateUserBodyDto {
  @IsOptional()
  @IsString()
  username?: string

  @IsOptional()
  @IsString()
  password?: string
}