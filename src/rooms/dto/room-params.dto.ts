import { ApiProperty } from "@nestjs/swagger"
import { IsMongoId } from "class-validator"

export class RoomParamsDto {
    @ApiProperty({ description: "ID of a room" })
    @IsMongoId()
    roomId: string
}