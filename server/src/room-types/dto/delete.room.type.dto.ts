import { IsString, IsMongoId } from "class-validator"

export class DeleteRoomTypeParamsDto {
  @IsString()
  @IsMongoId()
  roomTypeId: string
}