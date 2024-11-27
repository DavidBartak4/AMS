import { IsNotEmpty, IsString, MinLength } from "class-validator"

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  username: string

  @IsNotEmpty()
  @MinLength(6)
  password: string
}