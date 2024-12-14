import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { AttributeModel } from "./schemas/attribute.schema"
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
    const attribute = await this.attributeModel.create({ imageId: media._id, name: body.name, description: body.description})
    return {
      __v: attribute.__v,
      _id: attribute._id,
      image: media,
      name: attribute.name,
      description: attribute.description
    }
  }

  async getAttributes(query: GetAttributesQueryDto) {
    const attributesPage = await this.attributeModel.paginate({}, {  page: query.page, limit: query.limit, populate: { path: "imageId", model: "Media" } })
    if (query.page > attributesPage.totalPages) { throw new NotFoundException("Page not found") }
    const transformedDocs = await Promise.all(attributesPage.docs.map(async (attribute) => {
      const media = await this.mediaService.getMediaInfo(attribute.imageId)
      return {
        __v: attribute.__v,
        _id: attribute._id,
        image: media,
        name: attribute.name,
        description: attribute.description
      }
    }))
    return {
      ...attributesPage,
      docs: transformedDocs
    }
  }

  async getAttribute(attributeId: string) {
    const attribute = await this.attributeModel.findById(attributeId).populate("imageId").exec()
    if (!attribute) { throw new NotFoundException("Attribute not found") }
    const media = await this.mediaService.getMediaInfo(attribute.imageId)
    return {
      __v: attribute.__v,
      _id: attribute._id,
      image: media,
      name: attribute.name,
      description: attribute.description
    }
  }

  async updateAttribute(attributeId: string, body: UpdateAttributeBodyDto, file?: File) {
    const attribute = await this.attributeModel.findById(attributeId).exec()
    if (!attribute) { throw new NotFoundException("Attribute not found") }
    let media
    if (body.type) {
      if (attribute.imageId) { await this.mediaService.deleteMedia(attribute.imageId) }
      media = await this.mediaService.createMedia({ file: file, type: body.type, location: body.location })
      attribute.imageId = media._id
    } else {
      media = await this.mediaService.getMediaInfo(attribute.imageId)
    }
    if (body.name) attribute.name = body.name
    if (body.description) attribute.description = body.description
    await attribute.save()
    return {
      __v: attribute.__v,
      _id: attribute._id,
      image: media,
      name: attribute.name,
      description: attribute.description,
    }
  }

  async deleteAttribute(attributeId: string) {
    const attribute = await this.attributeModel.findById(attributeId).exec()
    if (!attribute) { throw new NotFoundException("Attribute not found") }
    if (attribute.imageId) { await this.mediaService.deleteMedia(attribute.imageId.toString()) }
    await this.attributeModel.deleteOne({ _id: attributeId })
    this.eventEmitter.emit("attribute.deleted", attributeId)
    return
  }
}