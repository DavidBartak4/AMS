import { ApiProperty, ApiPropertyOptional, PickType } from "@nestjs/swagger"
import { BaseMediaDto } from "./base-media.dto"
import { Expose } from "class-transformer"

export class MediaResponseDto extends PickType(BaseMediaDto, ["type", "location"]) {
    @ApiProperty()
    @Expose()
    id: string
    
    @ApiProperty({ nullable: true })
    @Expose()
    filename: string

    @ApiProperty({ nullable: true })
    @Expose()
    contentType: string
}