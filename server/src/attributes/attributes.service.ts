import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { AttributeDocument } from "./schemas/attribute.schema"
import { AttributeBodyDto } from "./dto/attribute.dto"
import { PatchAttributeBodyDto } from "./dto/patch.attribute.dto"
import { MediaService } from "src/media/media.service"

@Injectable()
export class AttributesService {
  constructor(@InjectModel("Attribute") private readonly attributeModel: Model<AttributeDocument>, private readonly mediaService: MediaService) {}

  async createAttribute(dto: AttributeBodyDto) {
    if (dto.imageId && !(await this.mediaService.doesMediaExist(dto.imageId))) {
      throw new BadRequestException("Media provided does not exist.");
    }    
    return await this.attributeModel.create(dto)
  }

  async getAttributes() {
    return this.attributeModel.find().exec()
  }

  async getAttribute(attributeId: string) {
    const attribute = await this.attributeModel.findById(attributeId)
    if (!attribute) {
      throw new NotFoundException(`Attribute with ID ${attributeId} not found.`)
    }
    return attribute
  }

  async patchAttribute(attributeId: string, dto: PatchAttributeBodyDto) {
    if (dto.imageId && !(await this.mediaService.doesMediaExist(dto.imageId))) {
      throw new BadRequestException("Media provided does not exist.");
    }    
    const updatedAttribute = await this.attributeModel.findByIdAndUpdate(attributeId, dto, { new: true })
    if (!updatedAttribute) {
      throw new NotFoundException(`Attribute with ID ${attributeId} not found.`)
    }
    return updatedAttribute
  }

  async deleteAttribute(attributeId: string) {
    const result = await this.attributeModel.deleteOne({ _id: attributeId })
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Attribute with ID ${attributeId} not found.`)
    }
    return
  }
}