import { BadRequestException, GatewayTimeoutException, InternalServerErrorException } from "@nestjs/common"

export const SettingsErrorMessages = {
    SETTINGS_EXIST: "Settings already exist",
    MAIL_DNS: "Mail DNS resolution failed, check the mail provider",
    MAIL_EAUTH: "Mail authentication failed, check mail username and password",
    MAIL_ETIMEDOUT: "Timeout occurred while attempting to connect to the SMTP server, check network and server latency",
    MAIL_ECONNECTION: "Could not connect to SMTP server, check mail port",
    MAIL_UNEXPECTED: "An unexpected error occurred during mail verification",
    UPDATE_SETTINGS: [
        "name must be a string",
        "name should not be empty",
        "mail.port must be a number",
        "mail.provider must be a string",
        "mail.auth.username must be a string",
        "mail.auth.username should not be empty",
        "mail.auth.password must be a string",
        "mail.auth.password should not be empty",
        "mail.useName must be a boolean"
    ]
}

export class MailEDNSException extends BadRequestException {
    constructor() {
        super(SettingsErrorMessages.MAIL_DNS)
    }
}

export class MailEAUTHException extends BadRequestException {
    constructor() {
        super(SettingsErrorMessages.MAIL_EAUTH)
    }
}

export class MailETIMEDOUTException extends GatewayTimeoutException {
    constructor() {
        super(SettingsErrorMessages.MAIL_ETIMEDOUT)
    }
}

export class MailECONNECTIONException extends GatewayTimeoutException {
    constructor() {
        super(SettingsErrorMessages.MAIL_ECONNECTION)
    }
}

export class UnexpectedMailErrorException extends InternalServerErrorException {
    constructor() {
        super(SettingsErrorMessages.MAIL_UNEXPECTED)
    }
}