import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common"
import { ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger"
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard"
import { RoomsService } from "./rooms.service"
import { CreateRoomMultipartDto } from "./dto/create-room.dto"
import { filterFileTypes } from "src/common/filters/file.filter"
import { FileFieldsInterceptor } from "@nestjs/platform-express"
import { RoomFiles } from "./room.types"
import { RoomParamsDto } from "./dto/room-params.dto"
import { UpdateRoomMultipartDto } from "./dto/update-room.dto"
import { RoomsQueryDto } from "./dto/rooms-query.dto"
import { ApiResponse } from "src/common/decorators/api-response.decorator"
import { RoomResponseDto } from "./dto/room-response.dto"
import { ApiErrorMessages } from "src/common/api.exceptions"
import { AuthErrorMessages } from "src/auth/auth.exceptions"
import { RoomErrorMessages } from "./room.exceptions"
import { AttributeErrorMessages } from "src/attributes/attribute.exceptions"
import { PaginatedRoomsResponseDto } from "./dto/paginated-rooms-response.dto"

@Controller("rooms")
@ApiTags("Rooms")
//@UseGuards(JwtAuthGuard)
export class RoomsController {
    constructor(private readonly roomsService: RoomsService) {}

    @Post()
    @ApiOperation({ summary: "Creates a room" })
    @ApiConsumes("multipart/form-data")
    @ApiResponse({ status: 401, description: [ApiErrorMessages.UNAUTHORIZED, AuthErrorMessages.JWT_EXPIRED]})
    @ApiResponse({ status: 404, description: AttributeErrorMessages.ATTRIBUTE_NOT_FOUND})
    @ApiResponse({ status: 400, description: [ApiErrorMessages.UNSUPPORTED_FILE_TYPE, ...ApiErrorMessages.MULTIPART_DATA] })
    @ApiResponse({ status: 409, description: [RoomErrorMessages.ROOM_CODE_ALREADY_IN_USE, RoomErrorMessages.MAIN_IMAGE_CONFLICT]})
    @ApiResponse({ status: 201, type: RoomResponseDto})
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: "mainImage", maxCount: 1 },
            { name: "image", maxCount: undefined }
        ], {
            fileFilter: filterFileTypes(["image/jpeg", "image/png", "image/webp"])
        }),
    )
    async createRoom(@Body() createRoomMultipartDto: CreateRoomMultipartDto, @UploadedFiles() files: RoomFiles) {
        const createRoomDto = createRoomMultipartDto.data
        return await this.roomsService.createRoom(createRoomDto, files)
    }

    @Get(":roomId")
    @ApiOperation({ summary: "Gets a room" })
    @ApiResponse({ status: 404, description: RoomErrorMessages.ROOM_NOT_FOUND})
    @ApiResponse({ status: 200, type: RoomResponseDto})
    async getRoom(@Param() roomParamsDto: RoomParamsDto) {
        return await this.roomsService.getRoom({ id: roomParamsDto.roomId })
    }

    @Patch(":roomId")
    @ApiOperation({ summary: "Updates a room" })
    @ApiConsumes("multipart/form-data")
    @ApiResponse({ status: 401, description: [ApiErrorMessages.UNAUTHORIZED, AuthErrorMessages.JWT_EXPIRED]})
    @ApiResponse({ status: 400, description: [ApiErrorMessages.UNSUPPORTED_FILE_TYPE, ...ApiErrorMessages.MULTIPART_DATA] })
    @ApiResponse({ status: 404, description: [RoomErrorMessages.ROOM_NOT_FOUND, AttributeErrorMessages.ATTRIBUTE_NOT_FOUND]})
    @ApiResponse({ status: 409, description: [RoomErrorMessages.ROOM_CODE_ALREADY_IN_USE, RoomErrorMessages.MAIN_IMAGE_CONFLICT]})
    @ApiResponse({ status: 200, type: RoomResponseDto})
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: "mainImage", maxCount: 1 },
            { name: "image", maxCount: undefined }
        ], {
            fileFilter: filterFileTypes(["image/jpeg", "image/png", "image/webp"])
        }),
    )
    async updateRoom(@Param() roomParamsDto: RoomParamsDto, @Body() updateRoomMultipartDto: UpdateRoomMultipartDto, @UploadedFiles() files: RoomFiles) {
        const updateRoomDto = updateRoomMultipartDto.data
        return await this.roomsService.updateRoom(roomParamsDto.roomId, updateRoomDto, files)
    }

    @Get()
    @ApiOperation({ summary: "Gets a paginated list of rooms" })
    @ApiResponse({ status: 401, description: [ApiErrorMessages.UNAUTHORIZED, AuthErrorMessages.JWT_EXPIRED]})
    @ApiResponse({ status: 200, type: PaginatedRoomsResponseDto})
    async getPaginatedRooms(@Query() roomsQueryDto: RoomsQueryDto) {
        return await this.roomsService.getPagiantedRooms(roomsQueryDto)
    }

    @Delete(":roomId")
    @ApiOperation({ summary: "Deletes a room" })
    @ApiResponse({ status: 401, description: [ApiErrorMessages.UNAUTHORIZED, AuthErrorMessages.JWT_EXPIRED]})
    @ApiResponse({ status: 404, description: RoomErrorMessages.ROOM_NOT_FOUND})
    @ApiResponse({ status: 200, type: RoomResponseDto})
    async deleteRoom(@Param() roomParamsDto: RoomParamsDto) {
        return await this.roomsService.deleteRoom(roomParamsDto.roomId)
    }
}