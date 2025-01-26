import { UnauthorizedException } from "@nestjs/common";

export const AuthErrorMessages = {
    JWT_EXPIRED: "JWT expired",
    LOGIN: [
        "username must be a string",
        "username should not be empty",
        "password must be a string",
        "password should not be empty",
    ],
    UPDATE_CREDENTIALS: [
        "username must be a string",
        "username should not be empty",
        "password must be a string",
        "password should not be empty",
    ]
}

export class JwtExpiredException extends UnauthorizedException {
    constructor() {
        super(AuthErrorMessages.JWT_EXPIRED)
    }
}