import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common"
import { Request } from "express"

@Injectable()
export class InternalOnlyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest()
    const clientIp = request.ip || request.connection.remoteAddress
    const allowedIps = ["127.0.0.1", "::1"]
    if (allowedIps.includes(clientIp)) {
      return true
    } else {
      throw new ForbiddenException("Access denied")
    }
  }
}