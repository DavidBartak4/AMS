import { Injectable, ConflictException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { AttributeDocument } from "./schemas/attribute.schema"
import { AttributeBodyDto } from "./dto/attribute.dto"

@Injectable()
export class AttributesService {
  constructor( @InjectModel("Attribute") private readonly attributeModel: Model<AttributeDocument>) {}

  async createAttribute(attributeBodyDto: AttributeBodyDto): Promise<AttributeDocument> {
    try {
      const createdAttribute = new this.attributeModel(attributeBodyDto)
      return await createdAttribute.save()
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException("Attribute name must be unique")
      }
      throw error
    }
  }

  async getAttributes() {

  }

  async getAttribute(attributeId: string) {

  }

  async patchAttribute(attributeId: string) {

  }

  async deleteAttribute(attributeId: string) {

  }
}