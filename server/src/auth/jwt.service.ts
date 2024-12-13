import { JwtModuleOptions, JwtService as BaseJwtService } from "@nestjs/jwt"

export class JwtService extends BaseJwtService {
    secret: any
    constructor(options: JwtModuleOptions) {
        super(options)
        this.secret = options.secret
    }
}