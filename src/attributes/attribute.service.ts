import { Injectable } from "@nestjs/common"
import { HandleDuplicateKeyMongooseError } from "src/common/decorators/handle-duplicate-key-mongoose-error.decorator"
import { AttributeErrorMessages, AttributeNotFoundException, MainImageConflictException } from "./attribute.exceptions"
import { CreateAttributeDto } from "./dto/create-attribute.dto"
import { File } from "multer"
import { MediaService } from "src/media/media.service"
import { Connection } from "mongoose"
import { plainToInstance } from "class-transformer"
import { AttributeResponseDto } from "./dto/attribute-response.dto"
import { InjectConnection, InjectModel } from "@nestjs/mongoose"
import { Attribute, AttributeModel } from "./schemas/AttributeSchema"
import { AttributesQueryDto } from "./dto/attributes-query.dto"
import { PaginatedAttributesResponseDto } from "./dto/paginated-attributes-response.dto"
import { UpdateAttributeDto } from "./dto/update-attribute.dto"
import { EventEmitter2 } from "@nestjs/event-emitter"

Injectable()
@HandleDuplicateKeyMongooseError("name", AttributeErrorMessages.ATTRIBUTE_NAME_IN_USE)
export class AttributesService {
    constructor(
        @InjectModel(Attribute.name) private readonly attributeModel: AttributeModel, 
        private readonly mediaService: MediaService, 
        @InjectConnection() private readonly connection: Connection,
        private readonly eventEmitter: EventEmitter2
    ) {}

    async createAttribute(createAttributeDto: CreateAttributeDto, imageFile?: File) {
        const session = await this.connection.startSession()
        session.startTransaction()
        try {
            if (createAttributeDto?.image && imageFile) {
                throw new MainImageConflictException()
            }
            const image = await this.mediaService.createMedia({
                url: createAttributeDto?.image,
                file: imageFile
            }, session)
            const attributeData = this.toAttribute(createAttributeDto, { imageId: image?.id })
            const attribute = await this.attributeModel.create(attributeData)
            const attributeResponse = this.toAttributeResponse(attribute, {image: image})
            await session.commitTransaction()
            return plainToInstance(AttributeResponseDto, attributeResponse, { excludeExtraneousValues: true })
        } catch (error) {
            await session.abortTransaction()
            throw error
        } finally {
            session.endSession()
        }
    }

    async getAttribute(filter: Partial<Attribute>) {
        const attribute = await this.attributeModel.findOne(filter).exec()
        if (!attribute) {
            throw new AttributeNotFoundException()
        }
        const image = await await this.mediaService.getMedia(attribute.imageId).catch(function() {
            return null
        })
        const attributeResponse = this.toAttributeResponse(attribute, {image: image})
        return plainToInstance(AttributeResponseDto, attributeResponse, { excludeExtraneousValues: true })
    }

    async getPaginatedAttributes(attributesQueryDto: AttributesQueryDto) {
        const { page, limit, ...filters} = attributesQueryDto
        const query: any = {}
        if (filters.name) {
            const escapedName = filters.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            query.$or = [
                { name: filters.name },
                { name: { $regex: escapedName, $options: "i" } }
            ]
        }
        const paginatedAttributes = await this.attributeModel.paginate(query, { page, limit })
        return plainToInstance(PaginatedAttributesResponseDto, paginatedAttributes, { excludeExtraneousValues: true })
    }

    async updateAttribute(attributeId: string, updateAttributeDto: UpdateAttributeDto, imageFile?: File) {
        const session = await this.connection.startSession()
        session.startTransaction()
        try {
            if (updateAttributeDto?.image && imageFile) {
                throw new MainImageConflictException()
            }
            const oldAttribute = await this.attributeModel.findById(attributeId).exec()
            if (!oldAttribute) {
                throw new AttributeNotFoundException()
            }
            const image = await this.mediaService.createMedia({
                url: updateAttributeDto?.image,
                file: imageFile
            }, session)
            if (image) {
                await this.mediaService.deleteMedia(oldAttribute.imageId).catch(function() {})
            }
            const attributeData = this.toAttribute(updateAttributeDto, { imageId: image?.id })
            const attribute = await this.attributeModel.findByIdAndUpdate(attributeId, attributeData, { new: true }).exec()
            const attributeResponse = this.toAttributeResponse(attribute, { image: image })
            await session.commitTransaction()
            return plainToInstance(AttributeResponseDto, attributeResponse, { excludeExtraneousValues: true })
        } catch(error) {
            session.abortTransaction()
            throw error
        } finally {
            session.endSession()
        }
    }

    async deleteAttribute(attributeId: string) {
        const attribute = await this.attributeModel.findByIdAndDelete(attributeId).exec()
        if (!attribute) {
            throw new AttributeNotFoundException()
        }
        const image = await this.mediaService.getMedia(attribute.imageId).catch(function() {
            return null
        })
        if (image) {
            await this.mediaService.deleteMedia(image.id)
        }
        this.eventEmitter.emit("attribute.deleted", attribute.id)
        return plainToInstance(AttributeResponseDto, this.toAttributeResponse(attribute, {image: image}), { excludeExtraneousValues: true })
    }

    private toAttribute(dto: any, attribute?: Partial<Attribute>) {
        attribute.name = attribute.name || dto.name
        attribute.description = attribute.description || dto.description
        return attribute
    }

    private toAttributeResponse(attribute: Attribute, attributeResponse?: Partial<AttributeResponseDto>) {
        attributeResponse.id = attributeResponse.id || attribute.id
        attributeResponse.name = attributeResponse.name || attribute.name
        attributeResponse.description = attributeResponse.description || attribute.description
        attributeResponse.image = attributeResponse.image || null
        return attributeResponse
    }
}