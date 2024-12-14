import { IsMongoId, IsString } from "class-validator"

export class AddRoomAttributeParamsDto {
  @IsString()
  @IsMongoId()
  roomId: string
}

export class AddRoomAttributeBodyDto {
    @IsString()
    @IsMongoId()
    attributeId: string
  }