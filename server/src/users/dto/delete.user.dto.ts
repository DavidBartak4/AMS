import { IsString, IsMongoId } from "class-validator"

export class DeleteUserParamsDto {
  @IsMongoId()
  @IsString()
  userId: string
}