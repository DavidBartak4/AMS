import { applyDecorators } from "@nestjs/common"
import { Transform } from "class-transformer"

export function NullToUndefined() {
    return applyDecorators(
        Transform(function({value}) {
            if (value === null) {
                return undefined
            } else {
                return value
            }
        })
    )
}