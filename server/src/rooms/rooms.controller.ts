import { Body, Controller, Post, UploadedFiles, UseGuards, UseInterceptors, Get, Patch, Delete, Param, ValidationPipe, Query, UploadedFile } from "@nestjs/common"
import { JwtAuthGuard } from "../auth/guards/jwt.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"
import { RoomsService } from "./rooms.service"
import { CreatetRoomBodyDto } from "./dto/create.room.dto"
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express"
import { filterFileTypes } from "src/common/helpers/fileInterceptor.helpers"
import { File } from "multer" 
import { GetRoomParamsDto } from "./dto/get.room.dto"
import { GetRoomsBodyDto, GetRoomsQueryDto } from "./dto/get.rooms.dto"
import { UpdateRoomBodyDto, UpdateRoomParamsDto } from "./dto/update.room.dto"
import { DeleteRoomParamsDto } from "./dto/delete.room.dto"
import { CreateRoomImagesBodyDto, CreateRoomImagesParamsDto } from "./dto/create.room.images.dto"
import { DeleteRoomImagesBodyDto, DeleteRoomImagesParamsDto } from "./dto/delete.room.images.dto"
import { UpdateRoomImagesBodyDto, UpdateRoomImagesParamsDto } from "./dto/update.room.images.dto"
import { RemoveRoomAttributeParamsDto } from "./dto/remove.room.attribute"
import { AddRoomAttributeBodyDto, AddRoomAttributeParamsDto } from "./dto/add.room.attribute.dto"

@Controller("rooms")
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @Roles("super-admin", "admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FilesInterceptor("files", Infinity, { fileFilter: filterFileTypes(["image/jpeg", "image/png", "image/webp"]) }))
  async createRoom(@Body() body: CreatetRoomBodyDto, @UploadedFiles() files: File[]) {
    return await this.roomsService.createRoom(body, files)
  }

  @Get(":roomId") 
  async getRoom(@Param(new ValidationPipe()) params: GetRoomParamsDto) {
    return await this.roomsService.getRoom(params.roomId)
  }

  @Get()
  async getRooms(@Body() body: GetRoomsBodyDto, @Query(new ValidationPipe()) query: GetRoomsQueryDto) {
    return await this.roomsService.getRooms(body, query)
  }

  @Patch(":roomId")
  @Roles("super-admin", "admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor("file", { fileFilter: filterFileTypes(["image/jpeg", "image/png", "image/webp"]) }))
  async updateRoom(@Param(new ValidationPipe()) params: UpdateRoomParamsDto, @Body() body: UpdateRoomBodyDto, @UploadedFile() file: File) {
    return await this.roomsService.updateRoom(params.roomId, body, file)
  }

  @Delete(":roomId")
  @Roles("super-admin", "admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteRoom(@Param(new ValidationPipe()) params: DeleteRoomParamsDto) {
    return await this.roomsService.deleteRoom(params.roomId)
  }

  @Post(":roomId/images")
  @Roles("super-admin", "admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FilesInterceptor("files", Infinity, { fileFilter: filterFileTypes(["image/jpeg", "image/png", "image/webp"]) }))
  async createRoomImages(@Param(new ValidationPipe()) params: CreateRoomImagesParamsDto, @Body() body: CreateRoomImagesBodyDto, @UploadedFiles() files: File[]) {
    return await this.roomsService.createRoomImages(params.roomId, body.location, files)
  }

  @Delete(":roomId/images")
  @Roles("super-admin", "admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteRoomImages(@Param(new ValidationPipe()) params: DeleteRoomImagesParamsDto, @Body() body: DeleteRoomImagesBodyDto) {
    return await this.roomsService.deleteRoomImages(params.roomId, body.imageIds)
  } 

  @Patch(":roomId/images")
  @Roles("super-admin", "admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FilesInterceptor("files", Infinity, { fileFilter: filterFileTypes(["image/jpeg", "image/png", "image/webp"]) }))
  async updateRoomImages(@Param(new ValidationPipe()) params: UpdateRoomImagesParamsDto, @Body() body: UpdateRoomImagesBodyDto, @UploadedFiles() files: File[]) {
    return await this.roomsService.updateRoomImages(params.roomId, body.location, files)
  }

  @Post(":roomId/attributes")
  @Roles("super-admin", "admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  async addRoomAttribute(@Param(new ValidationPipe()) params: AddRoomAttributeParamsDto, @Body() body: AddRoomAttributeBodyDto) {
    return await this.roomsService.addRoomAttribute(params.roomId, body.attributeId)
  }

  @Delete(":roomId/attributes/:attributeId")
  @Roles("super-admin", "admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  async removeRoomAttribute(@Param(new ValidationPipe()) params: RemoveRoomAttributeParamsDto) {
    return await this.roomsService.removeRoomAttribute(params.roomId, params.attributeId)
  }
}