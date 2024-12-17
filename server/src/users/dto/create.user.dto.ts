import { IsString } from "class-validator"

export class CreateUserBodyDto {
  @IsString()
  username: string

  @IsString()
  password: string
}