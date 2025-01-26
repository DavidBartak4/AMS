import { ApiProperty, ApiPropertyOptional, PickType } from "@nestjs/swagger"
import { BaseAttributeDto } from "./base-attribute.dto"
import { MediaResponseDto } from "src/media/dto/media-response.dto"
import { Expose } from "class-transformer"

export class AttributeResponseDto extends PickType(BaseAttributeDto, ["name"]) {
    @ApiProperty()
    @Expose()
    id: string

    @ApiProperty()
    @Expose()
    description: string

    @ApiProperty({ nullable: true })
    @Expose()
    image: MediaResponseDto
}