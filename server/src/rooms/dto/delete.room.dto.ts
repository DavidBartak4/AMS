import { Prop } from "@nestjs/mongoose"
import { IsMongoId, IsString } from "class-validator"

export class DeleteRoomParamsDto {
  @Prop()
  @IsString()
  @IsMongoId()
  roomId: string
}