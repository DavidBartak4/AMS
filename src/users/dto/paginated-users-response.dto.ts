import { PaginatedResponseDto } from "src/common/dto/paginated-response.dto"
import { UserResponseDto } from "./user-response.dto"
import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"

export class PaginatedUsersResponseDto extends PaginatedResponseDto<UserResponseDto> {
    @ApiProperty({ type: [UserResponseDto] })
    @Type(function() { return UserResponseDto })
    docs: UserResponseDto[]
}