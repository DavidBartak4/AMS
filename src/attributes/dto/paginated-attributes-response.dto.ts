import { PaginatedResponseDto } from "src/common/dto/paginated-response.dto"
import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { AttributeResponseDto } from "./attribute-response.dto"

export class PaginatedAttributesResponseDto extends PaginatedResponseDto<AttributeResponseDto> {
    @ApiProperty({ type: [AttributeResponseDto] })
    @Type(function() { return AttributeResponseDto })
    docs: AttributeResponseDto[]
}