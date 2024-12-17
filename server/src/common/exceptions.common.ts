import { BadRequestException, NotFoundException, UnauthorizedException } from "@nestjs/common"

export class PageNotFound extends NotFoundException {
    constructor() {
        super("Page not found")
    }
}