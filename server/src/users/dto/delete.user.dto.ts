import { IsString, IsMongoId } from "class-validator"

export class DeleteUserParamsDto {
  @IsString()
  @IsMongoId()
  userId: string
}