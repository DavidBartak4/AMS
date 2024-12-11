import { IsString, IsMongoId } from "class-validator"

export class GetAttributeParamsDto {
    @IsString()
    @IsMongoId()
    attributeId: string
}