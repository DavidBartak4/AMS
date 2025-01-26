import { Injectable } from "@nestjs/common"
import { HandleDuplicateKeyMongooseError } from "src/common/decorators/handle-duplicate-key-mongoose-error.decorator"
import { RoomErrorMessages, RoomMainImageConflictException, RoomNotFoundException } from "./room.exceptions"
import { Connection } from "mongoose"
import { EventEmitter2 } from "@nestjs/event-emitter"
import { MediaService } from "src/media/media.service"
import { Room, RoomModel } from "./schemas/room.schema"
import { InjectConnection, InjectModel } from "@nestjs/mongoose"
import { CreateRoomDto } from "./dto/create-room.dto"
import { RoomFiles } from "./room.types"
import { Media } from "src/media/schemas/media.schema"
import { RoomResponseDto } from "./dto/room-response.dto"
import { AttributesService } from "src/attributes/attribute.service"
import { plainToInstance } from "class-transformer"
import { UpdateRoomDto } from "./dto/update-room.dto"
import { RoomsQueryDto } from "./dto/rooms-query.dto"
import { PaginatedRoomsResponseDto } from "./dto/paginated-rooms-response.dto"

Injectable()
@HandleDuplicateKeyMongooseError("roomCode", RoomErrorMessages.ROOM_CODE_ALREADY_IN_USE)
export class RoomsService {
    constructor(
        @InjectModel(Room.name) private readonly roomModel: RoomModel, 
        private readonly mediaService: MediaService, 
        @InjectConnection() private readonly connection: Connection,
        private readonly eventEmitter: EventEmitter2,
        private readonly attributesService: AttributesService
    ) {}

    async createRoom(createRoomDto: CreateRoomDto, roomFiles: RoomFiles) {
        if (!createRoomDto) {
            const room = await this.roomModel.create({})
            const roomResponseDto = await this.toRoomResponse(room)
            return plainToInstance(RoomResponseDto, roomResponseDto, { excludeExtraneousValues: true })
        } else {
            const session = await this.connection.startSession()
            session.startTransaction()
            try {
                const roomData = await this.toRoom(createRoomDto, roomFiles, session)
                const room = await this.roomModel.create(roomData.room)
                await session.commitTransaction()
                const roomResponseDto = await this.toRoomResponse(room)
                return plainToInstance(RoomResponseDto, roomResponseDto, { excludeExtraneousValues: true })
            } catch (error) {
                await session.abortTransaction()
                throw error
            } finally {
                session.endSession()
            }
        }
    }

    async getRoom(filter: Partial<Room>) {
        const room = await this.roomModel.findOne(filter).exec()
        if (!room) {
            throw new RoomNotFoundException()
        }
        const roomResponseDto = await this.toRoomResponse(room)
        return plainToInstance(RoomResponseDto, roomResponseDto, { excludeExtraneousValues: true })
    }

    async getPagiantedRooms(roomsQueryDto: RoomsQueryDto) {
        const { page, limit, ...filters} = roomsQueryDto
        const query: any = {}
        if (filters.name) {
            const escapedName = filters.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            query.$or = [
                { name: filters.name },
                { name: { $regex: escapedName, $options: "i" } }
            ]
        }
        if (filters.roomTypeId) {
            query.roomTypeId = filters.roomTypeId
        }
        if (filters.priceValue) {
            query["price.value"] = filters.priceValue
        } else {
            if (filters.maxPrice && filters.minPrice) {
                query["price.value"] = { $gte: filters.minPrice, $lte: filters.maxPrice }
            } else if (filters.maxPrice) {
                query["price.value"] = { $lte: filters.maxPrice }
            } else if (filters.minPrice) {
                query["price.value"] = { $gte: filters.minPrice }
            }
        }
        if (filters.priceCurrency) {
            query["price.currency"] = filters.priceCurrency
        }
        if (filters.pricing) {
            query.pricing = filters.pricing
        }
        if (filters.roomCode) {
            query.roomCode = filters.roomCode
        }
        const paginatedRooms = await this.roomModel.paginate(query, { page, limit })
        const responseDocs = await Promise.all(paginatedRooms.docs.map(async function(room) {
            const roomResponseDto = await this.toRoomResponse(room)
            return plainToInstance(RoomResponseDto, roomResponseDto, { excludeExtraneousValues: true })
        }.bind(this)))
        return {
            ...paginatedRooms,
            docs: responseDocs
        }
    }

    async updateRoom(roomId: string, updateRoomDto: UpdateRoomDto, roomFiles: RoomFiles) {
        const session = await this.connection.startSession()
        session.startTransaction()
        try {
            const oldRoom = await this.roomModel.findById(roomId).exec()
            if (!oldRoom) {
                throw new RoomNotFoundException()
            }
            const roomData = await this.toRoom(updateRoomDto, roomFiles, session)
            if (roomData.mainImage) {
                await this.mediaService.deleteMedia(oldRoom.mainImageId, session)
            }
            const mediaService = this.mediaService
            if (updateRoomDto?.images || roomFiles.image.length > 0) {
                await Promise.all(oldRoom.imageIds.map(async function(imageId: string) {
                    await mediaService.deleteMedia(imageId, session)
                }))
            }
            const room = await this.roomModel.findByIdAndUpdate(roomId, roomData.room, { new: true }).exec()
            session.commitTransaction()
            const roomResponseDto = await this.toRoomResponse(room)
            return plainToInstance(RoomResponseDto, roomResponseDto, { excludeExtraneousValues: true })
        } catch (error) {
            session.abortTransaction()
            throw error
        } finally {
            session.endSession()
        }
    }

    private async toRoom(dto: any, roomFiles: RoomFiles, session?: any): Promise<{ room: Room, mainImage: Media, images: Media[] }> {
        const mediaService = this.mediaService
        if (dto?.mainImage && roomFiles.mainImage) {
            throw new RoomMainImageConflictException()
        }
        const mainImage = await this.mediaService.createMedia({
            url: dto?.mainImage,
            file: roomFiles.mainImage
        }, session)
        const images: Media[] = []
        if (dto?.images) {
            await Promise.all(dto.images.map(async function(imageUrl: string) {
                const image = await mediaService.createMedia({
                    url: imageUrl
                }, session)
                images.push(image)
            }))
        }
        if (roomFiles?.image) {
            await Promise.all(roomFiles.image.map(async function(file: File) {
                const image = await mediaService.createMedia({
                    file: file
                }, session)
                images.push(image)
            }))
        } 
        const imageIds = []
        images.map(function(image: Media) {
            imageIds.push(image.id)
        })
        if (dto?.attributeIds) {
            const attributeService = this.attributesService
            await Promise.all(dto.attributeIds.map(async function(attributeId) {
                await attributeService.getAttribute({ id: attributeId })
            }))
        }
        const room = new Room()
        room.name = dto.name
        room.description = dto.description
        room.price = dto.price
        room.pricing = dto.pricing
        room.roomCode = dto.roomCode
        room.roomType = dto.roomType
        room.capacity = dto.capacity
        room.imageIds = imageIds
        room.mainImageId = mainImage?.id
        room.attributeIds = dto?.attributeIds
        return { room: room, mainImage: mainImage, images: images }
    }

    private async toRoomResponse(room: Room): Promise<RoomResponseDto> {
        const attributes = []
        const attributeService = this.attributesService
        await Promise.all(room.attributeIds.map(async function(attributeId: string) {
            const attribute = await attributeService.getAttribute({ id: attributeId }).catch(function() {
                return null
            })
            if (attribute) {
                attributes.push(attribute)
            }
        }))
        let mainImage = await this.mediaService.getMedia(room.mainImageId).catch(function(error) {
            return null
        })
        const images = []
        const mediaService = this.mediaService
        await Promise.all(room.imageIds.map(async function(imageId) {
            const image = await mediaService.getMedia(imageId).catch(function() {
                return null
            })
            images.push(image)            
        }))
        const roomResponseDto = new RoomResponseDto()
        roomResponseDto.id = room.id
        roomResponseDto.name = room.name
        roomResponseDto.mainImage = mainImage
        roomResponseDto.images = images
        roomResponseDto.capacity = room.capacity
        roomResponseDto.price = room.price
        roomResponseDto.roomCode = room.roomCode
        roomResponseDto.roomType = room.roomType
        roomResponseDto.description = room.description
        roomResponseDto.attributes = attributes
        return roomResponseDto
    }

    async deleteRoom(roomId: string) {
        const room = await this.roomModel.findByIdAndDelete(roomId).exec()
        if (!room) {
            throw new RoomNotFoundException()
        }
        const roomResponseDto = await this.toRoomResponse(room)
        if (room.mainImageId) {
            await this.mediaService.deleteMedia(room.mainImageId).catch(function() {})
        }
        const mediaService = this.mediaService
        await Promise.all(room.imageIds.map(async function(imageId) {
            await mediaService.deleteMedia(imageId).catch(function() {})
        }))
        this.eventEmitter.emit("room.deleted", room.id)
        return plainToInstance(RoomResponseDto, roomResponseDto, { excludeExtraneousValues: true })
    }
}