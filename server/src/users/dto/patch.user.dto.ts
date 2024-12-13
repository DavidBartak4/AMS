import { IsString, MinLength, MaxLength, IsOptional } from "class-validator"

export class UpdateUserBodyDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  username?: string

  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(200)
  password?: string
}
