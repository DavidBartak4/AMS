import { BadRequestException, NotFoundException, UnauthorizedException } from "@nestjs/common"

export class UserNotFoundException extends NotFoundException {
    constructor() {
        super("User not found")
    }
}

export class UserAlreadyHasRoleException extends BadRequestException {
    constructor() {
        super("User already has this role")
    }
}

export class UserAlredyNotHaveRoleException extends BadRequestException {
    constructor() {
        super("User already does not have this role")
    }
}

export class InvalidCredentialsException extends UnauthorizedException {
    constructor() {
        super("Invalid credentials")
    }
}

export class UsernameAlreadyTakenException extends BadRequestException {
    constructor() {
        super("Username is already taken")
    }
}