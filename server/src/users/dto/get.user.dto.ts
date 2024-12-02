import { IsString, IsMongoId } from "class-validator"

export class GetUserParamsDto {
  @IsString()
  @IsMongoId()
  userId: string
}