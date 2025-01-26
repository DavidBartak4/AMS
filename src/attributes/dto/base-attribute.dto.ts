import { IsOptional, IsString, IsUrl, ValidateIf } from "class-validator"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Expose } from "class-transformer"

export class BaseAttributeDto {
    @ApiProperty()
    @Expose()
    @IsString()
    name: string

    @ApiPropertyOptional({ nullable: true })
    @Expose()
    @IsOptional()
    @IsString()
    description?: string

    @ApiPropertyOptional({ nullable: true })
    @IsOptional()
    @ValidateIf(function({image}) {
        return image !== null
    })
    @IsString()
    @IsUrl()
    image?: string | null
}