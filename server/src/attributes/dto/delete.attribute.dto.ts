import { IsString, IsMongoId } from "class-validator"

export class DeleteAttributeParamsDto {
  @IsString()
  @IsMongoId()
  attributeId: string
}