import { Body, Controller, Post, UploadedFile, UseGuards, UseInterceptors, Query, ValidationPipe, Get, Patch, Delete, Param } from "@nestjs/common"
import { AttributesService } from "./attributes.service"
import { JwtAuthGuard } from "src/auth/guards/jwt.guard"
import { RolesGuard } from "src/auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"
import { FileInterceptor } from "@nestjs/platform-express"
import { File } from "multer"
import { CreateAttributeBodyDto } from "./dto/create.attribute.dto"
import { DeleteAttributeParamsDto } from "./dto/delete.attribute.dto"
import { GetAttributeParamsDto } from "./dto/get.attribute.dto"
import { GetAttributesQueryDto } from "./dto/get.attributes.dto"
import { UpdateAttributeBodyDto } from "./dto/update.attribute.dto"

@Controller("attributes")
export class AttributesController {
  constructor(private readonly attributesService: AttributesService) {}

  @Post()
  @Roles("super-admin", "admin")
  @UseGuards(JwtAuthGuard, RolesGuard)  
  @UseInterceptors(FileInterceptor("file"))
  async createAttribute(@Body() body: CreateAttributeBodyDto, @UploadedFile() file?: File) {
    return await this.attributesService.createAttribute(body, file)
  }

  @Get()
  async getAttributes(@Query(new ValidationPipe()) query: GetAttributesQueryDto) {
    return await this.attributesService.getAttributes(query)
  }

  @Get("/:attributeId")
  async getAttribute(@Param(new ValidationPipe()) params: GetAttributeParamsDto) {
    return await this.attributesService.getAttribute(params.attributeId)
  }

  @Patch("/:attributeId")
  @Roles("super-admin", "admin")
  @UseGuards(JwtAuthGuard, RolesGuard)  
  @UseInterceptors(FileInterceptor("file"))
  async updateAttribute(@Param(new ValidationPipe()) params: GetAttributeParamsDto, @Body() body: UpdateAttributeBodyDto, @UploadedFile() file?: File) {
    return await this.attributesService.updateAttribute(params.attributeId, body, file)
  }

  @Delete("/:attributeId")
  @Roles("super-admin", "admin")
  @UseGuards(JwtAuthGuard, RolesGuard)  
  async deleteAttribute(@Param(new ValidationPipe()) params: DeleteAttributeParamsDto) {
    return await this.attributesService.deleteAttribute(params.attributeId)
  }
}