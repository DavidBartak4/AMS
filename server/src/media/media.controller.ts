import { Controller, Post, UploadedFile, UseInterceptors, Get, Param, Res, ValidationPipe, BadRequestException, Delete, UseGuards } from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { Response } from "express"
import { MediaService } from "./media.service"
import { MediaParamsDto } from "./dto/media"
import { JwtAuthGuard } from "src/auth/guards/jwt.guard"
import { RolesGuard } from "src/auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"
import { File } from "multer"

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("media")
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @Roles("super-admin", "admin")
  @UseInterceptors(FileInterceptor("file"))
  async uploadMedia(@UploadedFile() file: File) {
    if (!file) {
      throw new BadRequestException("No file to upload")
    }
    return await this.mediaService.uploadMediaInstance(file)
  }

  @Get()
  @Roles("super-admin", "admin")
  async listMedia() {
    return await this.mediaService.getMedia()
  }

  @Get(":mediaId/file")
  @Roles("super-admin", "admin")
  async getMediaFile(@Param(new ValidationPipe()) params: MediaParamsDto, @Res() res: Response) {
    const fileStream = await this.mediaService.getMediaFile(params.mediaId)
    fileStream.pipe(res)
  }  

  @Delete(":mediaId")
  @Roles("super-admin", "admin")
  async deleteMedia(@Param(new ValidationPipe()) params: MediaParamsDto) {
    return await this.mediaService.deleteMediaInstance(params.mediaId)
  }
}