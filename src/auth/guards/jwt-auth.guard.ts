import { Injectable, UnauthorizedException } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { TokenExpiredError } from "jsonwebtoken"
import { JwtExpiredException } from "../auth.exceptions"

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  handleRequest(err: any, user: any, info: any) {
    if (info instanceof TokenExpiredError) { throw new JwtExpiredException } 
    else if (err || !user) { throw new UnauthorizedException() }
    return user
  }
}