import { ApiProperty } from "@nestjs/swagger"
import { IsMongoId } from "class-validator"

export class AttributeParamsDto {
    @ApiProperty({ description: "ID of an attribute" })
    @IsMongoId()
    attributeId: string
}