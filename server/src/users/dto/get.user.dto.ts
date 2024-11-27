import { IsString, IsMongoId } from "class-validator"

export class GetUserParamsDto {
  @IsMongoId()
  @IsString()
  userId: string
}