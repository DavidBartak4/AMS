import { IsString } from "class-validator"

export class SignupBodyDto {
  @IsString()
  username: string

  @IsString()
  password: string
}