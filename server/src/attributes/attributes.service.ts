import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { AttributeModel } from "./schemas/attribute.schema"
import { MediaService } from "src/media/media.service"
import { CreateAttributeBodyDto } from "./dto/create.attribute.dto"
import { File } from "multer"
import { GetAttributesBodyDto, GetAttributesQueryDto } from "./dto/get.attributes.dto"
import { UpdateAttributeBodyDto } from "./dto/update.attribute.dto"
import { EventEmitter2 } from "@nestjs/event-emitter"
import { AttributeExpectedMediaUploadException, AttributeNameNotUniqueException, AttributeNotFoundException } from "./attributes.exceptions"
import { PageNotFoundException } from "src/common/exceptions.common"

@Injectable()
export class AttributesService {
  constructor(
    @InjectModel("Attribute") private readonly attributeModel: AttributeModel, 
    private readonly mediaService: MediaService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async createAttribute(body: CreateAttributeBodyDto, file?: File) {
    const existingAttribute = await this.attributeModel.findOne({ name: body.name }).exec()
    if (existingAttribute) { throw new AttributeNameNotUniqueException }
    const image = await this.mediaService.createMedia({ file: file, type: body.type, location: body.location })
    const attribute = await this.attributeModel.create({ 
      name: body.name,
      description: body.description,
      imageId: image._id.toString()
    })
    const attributeObject: any = attribute.toObject()
    attributeObject.image = image
    delete attributeObject.imageId
    return attributeObject
  }

  async getAttributes(query: GetAttributesQueryDto, body: GetAttributesBodyDto) {
    const populate = [{ path: "imageId", model: "Media" }]
    const filter: any = {}
    if (body.name !== undefined) { filter.name = body.partial ? { $regex: body.name, $options: "i" } : body.name }
    const attributes = await this.attributeModel.paginate(filter, { page: query.page, limit: query.limit, populate: populate })
    if (query.page > attributes.totalPages) { throw new PageNotFoundException }
    attributes.docs = await Promise.all(attributes.docs.map(async function (attribute: any) {
      attribute = attribute.toObject()
      attribute.image = attribute.imageId
      delete attribute.imageId
      return attribute
    }))
    return attributes
  }

  async getAttribute(attributeId: string) {
    const attribute = await this.attributeModel.findById(attributeId).populate({ path: "imageId", model: "Media" }).exec()
    if (!attribute) { throw new AttributeNotFoundException }
    const attributeObject: any = attribute.toObject()
    attributeObject.image = attribute.imageId
    delete attributeObject.imageId
    return attributeObject
  }

  async updateAttribute(attributeId: string, body: UpdateAttributeBodyDto, file?: File) {
    const attribute: any = await this.attributeModel.findById(attributeId).exec()
    if (!attribute) { throw new AttributeNotFoundException }
    if (body.name) {
      if (body.name === attribute.name) {
        throw new BadRequestException("Attribute name cannot be the same as the current attribute name")
      }
      const existingAttribute = await this.attributeModel.findOne({ name: body.name }).exec()
      if (existingAttribute && existingAttribute._id.toString() !== attributeId) {
        throw new AttributeNameNotUniqueException
      }
      attribute.name = body.name
    }
    if (body.description) { attribute.description = body.description }
    if (body.type) {
      let media
      if (body.type === "url") {
        if (!body.location) { throw new AttributeExpectedMediaUploadException }
        media = await this.mediaService.createMedia({ type: "url", location: body.location })
      }
      if (body.type === "file") {
        if (!file) { throw new AttributeExpectedMediaUploadException }
        media = await this.mediaService.createMedia({ type: "file", file: file })
      }
      if (attribute.imageId) {
        await this.mediaService.deleteMedia(attribute.imageId)
      }
      attribute.imageId = media._id.toString()
    }
    await attribute.save()
    const populatedAttribute: any = await this.attributeModel.findById(attributeId).populate({ path: "imageId", model: "Media" }).exec()
    const attributeObject = populatedAttribute.toObject()
    attributeObject.image = populatedAttribute.imageId
    delete attributeObject.imageId
    return attributeObject
  }

  async deleteAttribute(attributeId: string) {
    const attribute = await this.attributeModel.findById(attributeId).exec()
    if (!attribute) { throw new AttributeNotFoundException }
    if (attribute.imageId) { await this.mediaService.deleteMedia(attribute.imageId) }
    await this.attributeModel.deleteOne({ _id: attributeId })
    this.eventEmitter.emit("attribute.deleted", attributeId)
    return
  }
}