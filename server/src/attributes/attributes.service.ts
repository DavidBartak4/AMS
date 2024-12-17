import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Attribute, AttributeModel } from "./schemas/attribute.schema"
import { MediaService } from "src/media/media.service"
import { CreateAttributeBodyDto } from "./dto/create.attribute.dto"
import { File } from "multer"
import { GetAttributesQueryDto } from "./dto/get.attributes.dto"
import { UpdateAttributeBodyDto } from "./dto/update.attribute.dto"
import { EventEmitter2 } from "@nestjs/event-emitter"

@Injectable()
export class AttributesService {
  constructor(
    @InjectModel("Attribute") private readonly attributeModel: AttributeModel, 
    private readonly mediaService: MediaService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async createAttribute(body: CreateAttributeBodyDto, file?: File) {
    let media
    if (body.type) { media = await this.mediaService.createMedia({ file: file, type: body.type, location: body.location }) }
    let attribute: any = await this.attributeModel.create({ name: body.name, description: body.description, imageId: media._id })
    attribute = attribute.toObject()
    attribute.image = media
    attribute.imageId = undefined
    return attribute
  }

  async getAttributes(query: GetAttributesQueryDto) {
    const attributes = await this.attributeModel.paginate({}, { page: query.page, limit: query.limit, populate: { path: "imageId", model: "Media" } })
    if (query.page > attributes.totalPages) { throw new NotFoundException("Page not found") }
    attributes.docs = await Promise.all(attributes.docs.map(async function (attribute: any) {
      attribute = attribute.toObject()
      attribute.image = attribute.imageId
      attribute.imageId = undefined
      return attribute
    }))
    return attributes
  }

  async getAttribute(attributeId: string) {
    let attribute: any = await this.attributeModel.findById(attributeId).populate({ path: "imageId", model: "Media" }).exec()
    if (!attribute) { throw new NotFoundException("Attribute not found") }
    attribute = attribute.toObject()
    attribute.image = attribute.imageId
    attribute.imageId = undefined
    return attribute
  }

  async updateAttribute(attributeId: string, body: UpdateAttributeBodyDto, file?: File) {
    const attributeObject = await this.getAttribute(attributeId)
    let media = attributeObject.image
    let attribute: any = await this.attributeModel.findById(attributeId).populate({ path: "imageId", model: "Media" }).exec()
    if (body.name) { attribute.name = body.name }
    if (body.description) { attribute.description = body.description }
    if (body.type) {
      if (attribute.imageId) { await this.mediaService.deleteMedia(attribute.imageId._id.toString()) }
      media = await this.mediaService.createMedia({ file: file, type: body.type, location: body.location }) 
      attribute.imageId = media._id.toString()
    }
    await attribute.save()
    attribute = attribute.toObject()
    attribute.image = media
    attribute.imageId = undefined
    return attribute
  }

  async deleteAttribute(attributeId: string) {
    await this.getAttribute(attributeId)
    const attribute = await this.attributeModel.findById(attributeId).exec()
    if (attribute.imageId) { await this.mediaService.deleteMedia(attribute.imageId.toString()) }
    await this.attributeModel.deleteOne({ _id: attributeId })
    this.eventEmitter.emit("attribute.deleted", attributeId)
    return
  }
}