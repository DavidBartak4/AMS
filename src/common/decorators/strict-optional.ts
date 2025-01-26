import { applyDecorators } from "@nestjs/common"
import { ValidateIf } from "class-validator"

export function StrictOptional() {
    return applyDecorators(
        ValidateIf(function(obj, value) {
            return value !== undefined
        })
    )
}