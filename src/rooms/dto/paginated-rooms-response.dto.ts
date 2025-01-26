import { PaginatedResponseDto } from "src/common/dto/paginated-response.dto"
import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { RoomResponseDto } from "./room-response.dto"

export class PaginatedRoomsResponseDto extends PaginatedResponseDto<RoomResponseDto> {
    @ApiProperty({ type: [RoomResponseDto] })
    @Type(function() { return RoomResponseDto })
    docs: RoomResponseDto[]
}