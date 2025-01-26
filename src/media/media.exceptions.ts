import { BadRequestException, ConflictException, InternalServerErrorException, NotFoundException } from "@nestjs/common"

export const MediaErrorMessages = {
    MEDIA_NOT_FOUND: "Media not found",
    MEDIA_HAS_NO_STREAM: "Media has no stream",
    MEDIA_UPLOAD_FAILED: "Unexpected error occured while uploading media",
    INVALID_FILE_VALUE: "file should be a File",
    CREATE_TYPE_CONFLICT: "Cannot create media for more than one source"
}

export class MediaNotFoundException extends NotFoundException {
    constructor() {
        super(MediaErrorMessages.MEDIA_NOT_FOUND)
    }
}

export class MediaHasNoStreamException extends NotFoundException {
    constructor() {
        super(MediaErrorMessages.MEDIA_HAS_NO_STREAM)
    }
}

export class MediaUploadFailedException extends InternalServerErrorException {
    constructor() {
        super(MediaErrorMessages.MEDIA_UPLOAD_FAILED)
    }
}

export class InvalidFileValue extends BadRequestException {
    constructor() {
        super([MediaErrorMessages.INVALID_FILE_VALUE])
    }
}

export class MediaCreateTypeConflict extends ConflictException {
    constructor() {
        super(MediaErrorMessages.CREATE_TYPE_CONFLICT)
    }
}