import { Controller, Post, Body, Param, Get, ValidationPipe, Patch, Delete} from "@nestjs/common"
import { AttributesService } from "./attributes.service"
import { AttributeBodyDto, AttributeParamsDto } from "./dto/attribute.dto"

@Controller("attributes")
export class AttributesController {
  constructor(private readonly attributesService: AttributesService) {}

  @Post()
  async create(@Body() attributeBodyDto: AttributeBodyDto) {
    return this.attributesService.createAttribute(attributeBodyDto)
  }

  @Get()
  async getAttributes() {
    this.attributesService.getAttributes()
  }

  @Get(":attributeId")
  async getAttribute(@Param(new ValidationPipe()) params: AttributeParamsDto) {
    this.attributesService.getAttribute(params.attributeId)
  }

  @Patch(":attributeId")
  async patchAttribute(@Param(new ValidationPipe()) params: AttributeParamsDto) {
    this.attributesService.patchAttribute(params.attributeId)
  }

  @Delete(":attributeId")
  async deleteAttribute(@Param(new ValidationPipe()) params: AttributeParamsDto) {
    this.attributesService.deleteAttribute(params.attributeId)
  }
}
