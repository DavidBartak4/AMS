import { IsArray, IsMongoId, IsNumber, IsOptional, IsString, IsUrl, ValidateIf, ValidateNested } from "class-validator"
import { ApiPropertyOptional } from "@nestjs/swagger"
import { Expose, Type } from "class-transformer"
import { NullToUndefined } from "src/common/decorators/null-to-undefined.decorator"
import { Price } from "src/common/schemas/price.schema"

export class BaseRoomDto {
    @ApiPropertyOptional()
    @Expose()
    @IsOptional()
    @IsString()
    name?: string

    @ApiPropertyOptional()
    @Expose()
    @IsOptional()
    @IsString()
    @IsMongoId()
    roomTypeId?: string

    @ApiPropertyOptional()
    @Expose()
    @IsOptional()
    @IsString()
    description?: string

    @ApiPropertyOptional({ nullable: true })
    @IsOptional()
    @ValidateIf(function({image}) { return image !== null })
    @IsString()
    @IsUrl()
    mainImage?: string

    @ApiPropertyOptional()
    @Expose()
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @NullToUndefined()
    images?: string[]

    @ApiPropertyOptional()
    @Expose()
    @IsOptional()
    @ValidateNested()
    @Type(function() { return Price })
    price?: Price

    @ApiPropertyOptional()
    @Expose()
    @IsOptional()
    pricing?: string

    @ApiPropertyOptional()
    @Expose()
    @IsOptional()
    @IsString()
    roomCode?: string

    @ApiPropertyOptional()
    @Expose()
    @IsOptional()
    @IsNumber()
    capacity?: number

    @ApiPropertyOptional()
    @Expose()
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @IsMongoId({ each: true })
    @NullToUndefined()
    attributeIds?: string[]
}