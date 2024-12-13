import { Controller, Post, Body, Param, Get, ValidationPipe, Patch, Delete, UseGuards, Query } from "@nestjs/common"
import { AttributesService } from "./attributes.service"
import { JwtAuthGuard } from "src/auth/guards/jwt.guard"
import { RolesGuard } from "src/auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"
import { UseInterceptors, UploadedFile } from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { File } from "multer"
import { PostAttributeBodyDto } from "./dto/post.attribute.dto"
import { GetAttributeParamsDto } from "./dto/get.attribute.dto"
import { PatchAttributeBodyDto, PatchAttributeParamsDto } from "./dto/patch.attribute.dto"
import { DeleteAttributeParamsDto } from "./dto/delete.attribute.dto"
import { GetAdminsQueryDto } from "src/users/dto/get.admins.dto"

@Controller("attributes")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("super-admin", "admin")
export class AttributesController {
  constructor(private readonly attributesService: AttributesService) {}
  /*

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async create(@Body() body: PostAttributeBodyDto, @UploadedFile() file?: File) {
    return this.attributesService.createAttribute(body, file)
  }

  @Get()
  async getAttributes(@Query(new ValidationPipe({ transform: true })) query: GetAdminsQueryDto) {
    return this.attributesService.getAttributes(query)
  }
  
  @Get(":attributeId")
  async getAttribute(@Param(new ValidationPipe()) params: GetAttributeParamsDto) {
    return this.attributesService.getAttribute(params.attributeId)
  }

  @Patch(":attributeId")
  @UseInterceptors(FileInterceptor("file"))
  async patchAttribute(@Param(new ValidationPipe()) params: PatchAttributeParamsDto, @Body() body: PatchAttributeBodyDto, @UploadedFile() file?: File) {
    return this.attributesService.patchAttribute(params.attributeId, body, file)
  }

  @Delete(":attributeId")
  async deleteAttribute(@Param(new ValidationPipe()) params: DeleteAttributeParamsDto) {
    return this.attributesService.deleteAttribute(params.attributeId)
  }
    */
}