import { BadRequestException, NotFoundException } from "@nestjs/common"

export class RoomTypeNameNotUniqueException extends BadRequestException {
    constructor() {
        super("RoomType with this name already exist")
    }
}

export class RoomTypeExpectedMediaUploadException extends BadRequestException {
    constructor() {
        super("RoomType got no media for upload")
    }
}

export class RoomTypeNotFoundException extends NotFoundException {
    constructor() {
        super("RoomType not found")
    }
}

export class DuplicateAttributesException extends BadRequestException {
    constructor() {
        super("Duplicate attributes are not allowed")
    }
}