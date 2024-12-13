import { Controller, Get, Param, Res, ValidationPipe, UseGuards } from "@nestjs/common"
import { Response } from "express"
import { MediaService } from "./media.service"
import { GetMediaParamsDto } from "./dto/get.media.dto"
import { JwtAuthGuard } from "src/auth/guards/jwt.guard"
import { RolesGuard } from "src/auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"

@Controller("media")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("super-admin", "admin")
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  /*
  @Get(":mediaId")
  async getMediaStream(@Param(new ValidationPipe()) params: GetMediaParamsDto, @Res() res: Response) {
    const fileStream = await this.mediaService.getMediaStream(params.mediaId)
    fileStream.pipe(res)
  }
    */
}