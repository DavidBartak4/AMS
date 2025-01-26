import { ApiProperty, PickType } from "@nestjs/swagger"
import { BaseUserDto } from "./base-user.dto"
import { Expose } from "class-transformer"

export class UserResponseDto {
    @ApiProperty()
    @Expose()
    id: string

    @ApiProperty()
    @Expose()
    username: string

    @ApiProperty({ enum: ["super-admin", "admin"], default: "admin" })
    @Expose()
    role: string
}