import { ApiPropertyOptional, PartialType } from "@nestjs/swagger"
import { BaseAttributeDto } from "./base-attribute.dto"
import { Type } from "class-transformer"
import { ValidateNested } from "class-validator"
import { ParseStringifiedJson } from "src/common/decorators/parse-stringified-json.decorator"
import { NullToUndefined } from "src/common/decorators/null-to-undefined.decorator"

export class UpdateAttributeDto extends PartialType(BaseAttributeDto) {}

export class UpdateAttributeMultipartDto {
    @ApiPropertyOptional({ description: "Stringified JSON", type: UpdateAttributeDto })
    @ParseStringifiedJson(UpdateAttributeDto)
    @NullToUndefined()
    @ValidateNested()
    @Type(function() { return UpdateAttributeDto })
    data: UpdateAttributeDto

    @ApiPropertyOptional({
        description: "Image file for the attribute. Supported formats: png, jpeg and webp.",
        type: String,
        format: "binary",
    })
    image: any
}