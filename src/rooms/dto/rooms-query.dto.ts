import { QueryDto } from "src/common/dto/query.dto"
import { IntersectionType, PartialType, PickType } from "@nestjs/swagger"
import { BaseRoomDto } from "./base-room.dto"
import { PriceQueryDto } from "src/common/schemas/price.schema"

export class RoomsQueryDto extends IntersectionType(
    PartialType(QueryDto),
    PickType(BaseRoomDto, ["name", "roomTypeId", "capacity", "pricing", "roomCode"]),
    PartialType(PriceQueryDto)
) {}