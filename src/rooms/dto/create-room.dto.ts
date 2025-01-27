import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsDefined, ValidateNested } from "class-validator"
import { ParseStringifiedJson } from "src/common/decorators/parse-stringified-json.decorator"
import { BaseRoomDto } from "./base-room.dto"

export class CreateRoomDto extends BaseRoomDto {}

export class CreateRoomMultipartDto {
    @ApiProperty({ description: "Stringified JSON", type: CreateRoomDto })
    @ParseStringifiedJson(CreateRoomDto)
    @ValidateNested()
    @IsDefined()
    @Type(function() { return CreateRoomDto })
    data: CreateRoomDto

    @ApiPropertyOptional({
        description: "Image file for the attribute. Supported formats: png, jpeg and webp.",
        type: String,
        format: "binary",
    })
    image: any

    @ApiPropertyOptional({
        description: "Image file for the attribute. Supported formats: png, jpeg and webp.",
        type: String,
        format: "binary",
    })
    mainImage: any
}