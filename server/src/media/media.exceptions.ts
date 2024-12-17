import { BadRequestException, NotFoundException } from "@nestjs/common"

export class MediaNotFoundException extends NotFoundException {
    constructor() {
        super("Media not found")
    }
}

export class UnspecifiedMediaUploadException extends BadRequestException {
    constructor() {
        super("No media was specified for upload")
    }
}

export class FailedToUploadException extends BadRequestException {
    constructor() {
        super("Failed to upload media")
    }
}

export class MediaStreamLocationNotActiveException extends BadRequestException {
    constructor() {
        super("Stream location is not active")
    }
}

export class MediaStreamNotFoundException extends NotFoundException {
    constructor() {
        super("Media stream not found")
    }
}