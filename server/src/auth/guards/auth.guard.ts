import { AuthGuard } from "@nestjs/passport"
import { ExecutionContext } from "@nestjs/common"

export class OptionalAuthGuard extends AuthGuard("jwt") {
  handleRequest(err, user, info, context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    if (err || !user) {
      request.user = null
      return null
    }
    request.user = user
    return user
  }
}