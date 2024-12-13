import { Injectable, Query, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { AttributeModel } from "./schemas/attribute.schema"
import { MediaService } from "src/media/media.service"
import { File } from "multer"
import { GetAttributesQueryDto } from "./dto/get.attributes.dto"

@Injectable()
export class AttributesService {
  constructor(@InjectModel("Attribute") private readonly attributeModel: AttributeModel, private readonly mediaService: MediaService) {}

  /*
  async createAttribute(dtoIn) {
    
    if (file) {
      image = await this.mediaService.createMedia(file)
    }
    return await this.attributeModel.create({
      name: name,
      description: description,
      image: image
    })
  }

  async getAttributes(@Query() query: GetAttributesQueryDto) {
    return await this.attributeModel.paginate({}, { page: query.page, limit: query.limit })
  }

  async getAttribute(attributeId: string) {
    const attribute = await this.attributeModel.findById(attributeId)
    if (!attribute) { throw new NotFoundException(`Attribute with ID ${attributeId} not found.`) }
    return attribute
  }

  async patchAttribute(attributeId: string, dtoIn: any, file: File) {
    if (file) {
      const media: any = await this.mediaService.createMedia(file)
      dtoIn.image = media
    }
    const attribute = await this.attributeModel.findByIdAndUpdate(attributeId, { ...dtoIn }, { new: true })
    if (!attribute) { throw new NotFoundException(`Attribute with ID ${attributeId} not found.`) }
    return attribute
  }

  async deleteAttribute(attributeId: string) {
    const attribute = await this.getAttribute(attributeId)
    if (attribute.image._id) { await this.mediaService.deleteMedia(attribute.image._id.toString()) }
    await this.attributeModel.deleteOne({ _id: attributeId })
  }
    */
}