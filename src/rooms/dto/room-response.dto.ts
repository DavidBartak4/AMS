import { ApiProperty } from "@nestjs/swagger"
import { Expose, Type } from "class-transformer"
import { AttributeResponseDto } from "src/attributes/dto/attribute-response.dto"
import { Price } from "src/common/schemas/price.schema"
import { MediaResponseDto } from "src/media/dto/media-response.dto"

export class RoomResponseDto {
    @ApiProperty()
    @Expose()
    id: string

    @ApiProperty({ nullable: true })
    @Expose()
    name: string | null

    @ApiProperty({ nullable: true })
    @Expose()
    description: string | null

    @ApiProperty({ nullable: true })
    @Expose()
    roomType: string | null

    @ApiProperty({ nullable: true, type: MediaResponseDto })
    @Expose()
    mainImage: MediaResponseDto | null

    @ApiProperty({ type: MediaResponseDto, isArray: true })
    @Expose()
    images: MediaResponseDto[]

    @ApiProperty({ type: Price })
    @Expose()
    @Type(function() { return Price })
    price: Price

    @ApiProperty({ nullable: true })
    @Expose()
    pricing: string | null

    @ApiProperty({ nullable: true, description: "Must be unique" })
    @Expose()
    roomCode: string | null

    @ApiProperty({ nullable: true})
    @Expose()
    capacity: number | null

    @ApiProperty({ type: AttributeResponseDto, isArray: true })
    @Expose()
    attributes: AttributeResponseDto[]
}