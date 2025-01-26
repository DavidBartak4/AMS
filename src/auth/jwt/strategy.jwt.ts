import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { ConfigService } from "@nestjs/config"
import { ExtractJwt, Strategy } from "passport-jwt"
import { UsersService } from "src/users/users.service"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService, private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get("JWT_SECRET"),
    })
  }

  async validate(payload: any) {
    const userExists = await this.usersService.getUserExists({ id: payload.sub })
    if (!userExists) { throw new UnauthorizedException() }
    return { id: payload.sub, username: payload.username, role: payload.role }
  }
}