import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger"
import { BaseRoomDto } from "./base-room.dto"
import { IsOptional, ValidateNested } from "class-validator"
import { ParseStringifiedJson } from "src/common/decorators/parse-stringified-json.decorator"
import { NullToUndefined } from "src/common/decorators/null-to-undefined.decorator"
import { Type } from "class-transformer"

export class UpdateRoomDto extends PartialType(BaseRoomDto) {}

export class UpdateRoomMultipartDto {
    @ApiProperty({ description: "Stringified JSON", type: UpdateRoomDto })
    @IsOptional()
    @ParseStringifiedJson(UpdateRoomDto)
    @NullToUndefined()
    @ValidateNested()
    @Type(function() { return UpdateRoomDto })
    data: UpdateRoomDto
   
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