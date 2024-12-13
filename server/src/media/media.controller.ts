import { Controller, Get, Param, Res, ValidationPipe, UseGuards, Post, Body, UseInterceptors, UploadedFile } from "@nestjs/common"
import { Response } from "express"
import { MediaService } from "./media.service"
import { JwtAuthGuard } from "src/auth/guards/jwt.guard"
import { RolesGuard } from "src/auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"
import { GetMediaParamsDto } from "./dto/get.media.dto"
import { File } from "multer"
import { FileInterceptor } from "@nestjs/platform-express"

@Controller("media")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("super-admin", "admin")
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post("/upload/url")
  async createMediaByUrl(@Body() body: any) {
    return await this.mediaService.createMediaByUrl(body)
  }

  @Post("/upload/file")
  @UseInterceptors(FileInterceptor("file"))
  async createMediaByFile(@UploadedFile() file: File) {
    return await this.mediaService.createMediaByFile(file)
  }

  @Get(":mediaId/stream")
  async getMediaStream(@Param(new ValidationPipe()) params: GetMediaParamsDto, @Res() res: Response) {
    const fileStream = await this.mediaService.getMediaStream(params.mediaId)
    fileStream.pipe(res)
  }

  @Get(":mediaId/info")
  async getMediaInfo(@Param(new ValidationPipe()) params: GetMediaParamsDto) {
    return await this.mediaService.getMediaInfo(params.mediaId)
  }
}