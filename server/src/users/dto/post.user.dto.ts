import { IsString, MinLength } from "class-validator"

export class PostUserBodyDto {
  @MinLength(6)
  @IsString()
  username: string

  @MinLength(6)
  @IsString()
  password: string
}