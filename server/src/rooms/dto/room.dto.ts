import { IsString, IsMongoId } from "class-validator"

export class RoomParamsDto {
  @IsString()
  @IsMongoId()
  roomId: string
}