import { Type } from "class-transformer"
import { BaseAttributeDto } from "./base-attribute.dto"
import { IsDefined, ValidateNested } from "class-validator"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { ParseStringifiedJson } from "src/common/decorators/parse-stringified-json.decorator"
import { NullToUndefined } from "src/common/decorators/null-to-undefined.decorator"

export class CreateAttributeDto extends BaseAttributeDto {}

export class CreateAttributeMultipartDto {
    @ApiProperty({ description: "Stringified JSON", type: CreateAttributeDto })
    @IsDefined()
    @ParseStringifiedJson(CreateAttributeDto)
    @NullToUndefined()
    @ValidateNested()
    @Type(function() { return CreateAttributeDto })
    data: CreateAttributeDto

    @ApiPropertyOptional({
        description: "Image file for the attribute. Supported formats: png, jpeg and webp.",
        type: String,
        format: "binary",
    })
    image: any
}