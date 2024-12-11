import { Injectable, Query, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { AttributeDocument, AttributeModel } from "./schemas/attribute.schema"
import { MediaService } from "src/media/media.service"
import { File } from "multer"
import { PostAttributeBodyDto } from "./dto/post.attribute.dto"
import { GetAttributesQueryDto } from "./dto/get.attributes.dto"
import { PatchAttributeBodyDto } from "./dto/patch.attribute.dto"

@Injectable()
export class AttributesService {
  constructor(@InjectModel("Attribute") private readonly attributeModel: AttributeModel, private readonly mediaService: MediaService) {}

  async createAttribute(dto: PostAttributeBodyDto, file: File) {
    const attribute: Partial<AttributeDocument> = { ...dto }
    if (file) {
      const media = await this.mediaService.createMedia(file)
      attribute.imageId = media._id.toString()
    }
    return await this.attributeModel.create(attribute)
  }

  async getAttributes(@Query() query: GetAttributesQueryDto) {
    const filter = {}
    const options = { page: query.page || 1, limit: query.limit || 10 }
    return await this.attributeModel.paginate(filter, options)
  }

  async getAttribute(attributeId: string) {
    const attribute = await this.attributeModel.findById(attributeId)
    if (!attribute) {
      throw new NotFoundException(`Attribute with ID ${attributeId} not found.`)
    }
    return attribute
  }

  async patchAttribute(attributeId: string, dto: PatchAttributeBodyDto, file) {
    const attribute: Partial<AttributeDocument> = { ...dto }
    if (file) {
      const media = await this.mediaService.createMedia(file)
      attribute.imageId = media._id.toString()
    }
    const updatedAttribute = await this.attributeModel.findByIdAndUpdate(attributeId, attribute, { new: true })
    if (!updatedAttribute) {
      throw new NotFoundException(`Attribute with ID ${attributeId} not found.`)
    }
    return updatedAttribute
  }

  async deleteAttribute(attributeId: string) {
    const attribute = await this.getAttribute(attributeId)
    if (attribute.imageId) {
      await this.mediaService.deleteMedia(attribute.imageId)
    }
    await this.attributeModel.deleteOne({ _id: attributeId })
    return
  }
}