import { QueryDto } from "src/common/dto/query.dto"
import { ApiPropertyOptional, IntersectionType, PartialType, PickType } from "@nestjs/swagger"
import { BaseUserDto } from "./base-user.dto"
import { Expose } from "class-transformer"
import { IsOptional, IsString } from "class-validator"

export class UsersQueryDto extends IntersectionType(
    PartialType(QueryDto),
    PartialType(PickType(BaseUserDto, ["role"]))
) {
    @ApiPropertyOptional()
    @Expose()
    @IsOptional()
    @IsString()
    username: string
}