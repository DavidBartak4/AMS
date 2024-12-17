import { BadRequestException, NotFoundException } from "@nestjs/common"

export class ConfigurationNotFoundException extends NotFoundException {
    constructor() {
        super("Configuration not found")
    }
}

export class MailVerificationFailedException extends BadRequestException {
    constructor() {
        super("Mail configuration verification failed")
    }
}

export class ConfigurationAlreadyExistException extends BadRequestException {
    constructor() {
        super("Configuration already exist")
    }
}