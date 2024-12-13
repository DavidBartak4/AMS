import { Injectable } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { JwtService } from "./jwt.service"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(jwtService: JwtService) {
    super({ jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey: jwtService.secret })
  }

  async validate(payload: any) {
    return { id: payload.sub, username: payload.username, roles: payload.roles }
  }
}