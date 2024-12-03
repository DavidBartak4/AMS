import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  ValidationPipe,
  Patch,
  Delete,
  UseGuards,
} from "@nestjs/common"
import { AttributesService } from "./attributes.service"
import { AttributeBodyDto, AttributeParamsDto } from "./dto/attribute.dto"
import { PatchAttributeBodyDto } from "./dto/patch.attribute.dto"
import { JwtAuthGuard } from "src/auth/guards/jwt.guard"
import { RolesGuard } from "src/auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"

@Controller("attributes")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("super-admin", "admin")
export class AttributesController {
  constructor(private readonly attributesService: AttributesService) {}

  @Post()
  async create(@Body() body: AttributeBodyDto) {
    return this.attributesService.createAttribute(body)
  }

  @Get()
  async getAttributes() {
    return this.attributesService.getAttributes()
  }

  @Get(":attributeId")
  async getAttribute(@Param(new ValidationPipe()) params: AttributeParamsDto) {
    return this.attributesService.getAttribute(params.attributeId)
  }

  @Patch(":attributeId")
  async patchAttribute(
    @Param(new ValidationPipe()) params: AttributeParamsDto,
    @Body() dto: PatchAttributeBodyDto,
  ) {
    return this.attributesService.patchAttribute(params.attributeId, dto)
  }

  @Delete(":attributeId")
  async deleteAttribute(
    @Param(new ValidationPipe()) params: AttributeParamsDto,
  ) {
    return this.attributesService.deleteAttribute(params.attributeId)
  }
}