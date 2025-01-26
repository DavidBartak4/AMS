import { BadRequestException } from "@nestjs/common"
import { plainToInstance, Transform } from "class-transformer"

export function ParseStringifiedJson(type?: any) {
    return Transform(function({value, key}) {
        if (typeof value !== "string") {
            throw new BadRequestException(`${key} must be a string`)
        }
        try {
            value = JSON.parse(value)
        } catch (error) {
            throw new BadRequestException(`${key} is invalid JSON`)
        }
        if (type) {
            return plainToInstance(type, value)
        }
    })
}