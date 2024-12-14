import { Injectable, Query, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Attribute, AttributeModel } from "./schemas/attribute.schema"
import { MediaService } from "src/media/media.service"
import { CreateAttributeBodyDto } from "./dto/create.attribute.dto"
import { File } from "multer"
import { GetAttributesQueryDto } from "./dto/get.attributes.dto"
import { UpdateAttributeBodyDto } from "./dto/update.attribute.dto"

@Injectable()
export class AttributesService {
  constructor(@InjectModel("Attribute") private readonly attributeModel: AttributeModel, private readonly mediaService: MediaService) {}

  async createAttribute(body: CreateAttributeBodyDto, file: File): Promise<any> {
    const media = await this.mediaService.createMedia({ file: file, type: body.type, location: body.location })
    const attribute = await this.attributeModel.create({ imageId: media._id, name: body.name, description: body.description})
    return {
      image: media,
      name: attribute.name,
      description: attribute.description
    }
  }

  async getAttributes(query: GetAttributesQueryDto) {
    
  }

  async getAttribute(attributeId: string) {

  }

  async updateAttribute(attributeId: string, body: UpdateAttributeBodyDto) {

  }

  async deleteAttribute(attributeId: string) {

  }
}