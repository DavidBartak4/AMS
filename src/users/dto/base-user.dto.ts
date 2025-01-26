import { IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Expose } from "class-transformer"

export class BaseUserDto {
    @ApiProperty()
    @Expose()
    @IsString()
    @IsNotEmpty()
    username: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password: string

    @ApiPropertyOptional({ enum: ["super-admin", "admin"], default: "admin" })
    @Expose()
    @IsOptional()
    @IsIn(["super-admin", "admin"])
    role?: string
}