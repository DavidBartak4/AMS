import { Controller, Post, UploadedFile, UseInterceptors, Get, Param, Res, ValidationPipe, BadRequestException, Delete } from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { Response } from "express"
import { MediaService } from "./media.service"
import { MediaParamsDto } from "./dto/media"

@Controller("media")
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async uploadMedia(@UploadedFile() file: Express.MulterFile) {
    if (!file) {
      throw new BadRequestException("No file uploaded")
    }
    return await this.mediaService.uploadMedia(file)
  }

  @Get()
  async listMedia() {
    return await this.mediaService.listMedia()
  }

  @Get(":mediaId/file")
  async getMediaFile(@Param(new ValidationPipe()) params: MediaParamsDto, @Res() res: Response) {
    return await this.mediaService.getMediaFile(params.mediaId, res)
  }

  @Delete(":mediaId")
  async deleteMedia(@Param(new ValidationPipe()) params: MediaParamsDto) {
    await this.mediaService.deleteMedia(params.mediaId)
    return
  }
}