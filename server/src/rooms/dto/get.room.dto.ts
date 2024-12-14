import { IsString, IsMongoId } from "class-validator"

export class GetRoomParamsDto {
  @IsString()
  @IsMongoId()
  roomId: string
}