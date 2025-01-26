import { NotFoundException, UnauthorizedException } from "@nestjs/common"

export const UsersErrorMessages = {
    INVALID_CREDENTIALS: "Invalid credentials",
    USERNAME_IN_USE: "Username is already in use",
    USER_NOT_FOUND: "User not found",
    USER_PARAMS: ["userId must be a mongodb id"],
    CREATE_USER: [
        "username must be a string",
        "username should not be empty",
        "password must be a string",
        "password should not be empty",
        "role must be one of the following values: super-admin, admin"
    ],
    USERS_QUERY: ["username must be a string", "role must be a string", "role must be one of the following values: super-admin, admin"]
}

export class UserNotFoundException extends NotFoundException {
    constructor() {
        super(UsersErrorMessages.USER_NOT_FOUND)
    }
}

export class InvalidCredentialsException extends UnauthorizedException {
    constructor() {
        super(UsersErrorMessages.INVALID_CREDENTIALS)
    }
}