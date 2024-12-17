import { IsString, MinLength, MaxLength } from "class-validator"

export class CreateUserBodyDto {
  @IsString()
  //@MinLength(3)
  //@MaxLength(20)
  username: string

  @IsString()
  //@MinLength(8)
  //@MaxLength(200)
  password: string
}