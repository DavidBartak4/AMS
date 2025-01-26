import { ApiResponse as DefaultApiResponse } from "@nestjs/swagger"
import { applyDecorators } from "@nestjs/common"

function formatErrors(errors: string[]): string {
    return errors.map(function(error, index) { return `${error}` }).join("<br>")
}

interface ApiResponseOtions {
    status: number,
    description?: string | string[]
    type?: any
    content?: any
}

export function ApiResponse(apiResponseOptions: ApiResponseOtions) {
    const description = Array.isArray(apiResponseOptions.description) ? formatErrors(apiResponseOptions.description) : apiResponseOptions.description
    return applyDecorators(
        DefaultApiResponse({ status: apiResponseOptions.status, description: description, type: apiResponseOptions.type})
    )
}