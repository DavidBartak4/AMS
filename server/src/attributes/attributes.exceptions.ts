import { BadRequestException, NotFoundException } from "@nestjs/common";

export class AttributeNameNotUniqueException extends BadRequestException {
    constructor() {
        super("Attribute with this name already exist")
    }
}

export class AttributeNotFoundException extends NotFoundException {
    constructor() {
        super("Attribute not found")
    }
}

export class AttributeExpectedMediaUploadException extends BadRequestException {
    constructor() {
        super("Attribute got no media for upload")
    }
}