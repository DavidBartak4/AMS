import { IsString, IsMongoId } from "class-validator"

export class GetRoomTypeParamsDto {
  @IsString()
  @IsMongoId()
  roomTypeId: string
}