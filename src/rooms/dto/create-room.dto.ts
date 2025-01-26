import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsOptional, ValidateNested } from "class-validator"
import { ParseStringifiedJson } from "src/common/decorators/parse-stringified-json.decorator"
import { BaseRoomDto } from "./base-room.dto"
import { NullToUndefined } from "src/common/decorators/null-to-undefined.decorator"

export class CreateRoomDto extends BaseRoomDto {}

export class CreateRoomMultipartDto {
    @ApiProperty({ description: "Stringified JSON", type: CreateRoomDto })
    @IsOptional()
    @ParseStringifiedJson(CreateRoomDto)
    @NullToUndefined()
    @ValidateNested()
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