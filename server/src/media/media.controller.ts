import { Controller, Get, Param, Res, ValidationPipe, UseGuards, Post, UseInterceptors, UploadedFile, Body } from "@nestjs/common"
import { Response } from "express"
import { MediaService } from "./media.service"
import { JwtAuthGuard } from "src/auth/guards/jwt.guard"
import { RolesGuard } from "src/auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"
import { GetMediaParamsDto } from "./dto/get.media.dto"
import { File } from "multer"
import { FileInterceptor } from "@nestjs/platform-express"
import { CreateMediaBodyDto } from "./dto/create.media.dto"

@Controller("media")
@Roles("super-admin", "admin")
@UseGuards(JwtAuthGuard, RolesGuard)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async createMedia(@UploadedFile() file: File, @Body() body: CreateMediaBodyDto) {
    if (body.type === "file") {
      return await this.mediaService.createMediaByFile(file)
    } else {
      return await this.mediaService.createMediaByUrl(body.url)
    }
  }

  @Get(":mediaId/stream")
  async getMediaStream(@Param(new ValidationPipe()) params: GetMediaParamsDto, @Res() res: Response) {
    const stream = await this.mediaService.getMediaStream(params.mediaId)
    stream.pipe(res)
  }

  @Get(":mediaId/info")
  async getMediaInfo(@Param(new ValidationPipe()) params: GetMediaParamsDto) {
    return await this.mediaService.getMediaInfo(params.mediaId)
  }
}