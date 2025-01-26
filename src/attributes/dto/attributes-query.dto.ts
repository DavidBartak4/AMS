import { QueryDto } from "src/common/dto/query.dto"
import { IntersectionType, PartialType, PickType } from "@nestjs/swagger"
import { BaseAttributeDto } from "./base-attribute.dto"

export class AttributesQueryDto extends IntersectionType(
    PartialType(QueryDto),
    PartialType(PickType(BaseAttributeDto, ["name"]))
) {}