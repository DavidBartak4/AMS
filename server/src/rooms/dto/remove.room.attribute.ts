import { IsMongoId, IsString } from "class-validator"

export class RemoveRoomAttributeParamsDto {
  @IsString()
  @IsMongoId()
  roomId: string

  @IsString()
  @IsMongoId()
  attributeId: string
}