import { ConflictException, NotFoundException } from "@nestjs/common";

export const AttributeErrorMessages = {
    ATTRIBUTE_NAME_IN_USE: "Attribute name is already in use",
    MAIN_IMAGE_CONFLICT: "image (data) and image (file) conflict",
    ATTRIBUTE_NOT_FOUND: "Attribute not found",
    ATTRIBUTE_PARAMS: ["attributeId must be a mongodb id"],
    CREATE_ATTRIBUTE: [
        "data should not be null or undefined",
        "name must be a string",
        "description must be a string",
        "image must be an url"
    ],
    UPDATE_ATTRIBUTE: [
        "name must be a string",
        "description must be a string",
        "image must be an url"
    ],
    ATTRIBUTE_QUERY: [
        "name must be a string",
        "description must be a string"
    ]
}

export class AttributeNotFoundException extends NotFoundException {
    constructor() {
        super(AttributeErrorMessages.ATTRIBUTE_NOT_FOUND)
    }
}

export class MainImageConflictException extends ConflictException {
    constructor() {
        super(AttributeErrorMessages.MAIN_IMAGE_CONFLICT)
    }
}