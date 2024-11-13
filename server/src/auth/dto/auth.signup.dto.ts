import { IsNotEmpty, IsString, MinLength } from "class-validator"

export class AuthSignupDto {
  @IsNotEmpty()
  @IsString()
  username: string

  @IsNotEmpty()
  @MinLength(6)
  password: string
}