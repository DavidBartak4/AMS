import { Controller, Get, Req, UseGuards } from "@nestjs/common"
import { Request } from "express"
import { InternalOnlyGuard } from "./common/guards/interval.only.guard"

@Controller()
export class AppController {
  @Get()
  @UseGuards(InternalOnlyGuard)
  getServerInfo(@Req() req: Request) {
    const protocol = req.headers["x-forwarded-proto"] || req.protocol
    const host = req.headers["x-forwarded-host"] || req.get("host")
    return { protocol, host }
  }
}