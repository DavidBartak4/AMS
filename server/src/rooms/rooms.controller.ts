import { Body, Controller, Post, UploadedFiles, UseGuards, UseInterceptors, Get, Patch, Delete, Param, ValidationPipe, Query } from "@nestjs/common"
import { JwtAuthGuard } from "../auth/guards/jwt.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"
import { RoomsService } from "./rooms.service"
import { CreatetRoomBodyDto } from "./dto/create.room.dto"
import { FilesInterceptor } from "@nestjs/platform-express"
import { filterFileTypes } from "src/common/helpers/fileInterceptor.helpers"
import { File } from "multer" 
import { GetRoomParamsDto } from "./dto/get.room.dto"
import { GetRoomsBodyDto, GetRoomsQueryDto } from "./dto/get.rooms.dto"
import { UpdateRoomBodyDto, UpdateRoomParamsDto } from "./dto/update.room.dto"
import { DeleteRoomParamsDto } from "./dto/delete.room.dto"
import { AddImagesToRoomBodyDto, AddImagesToRoomParamsDto } from "./dto/addImagesToRoom.dto"

@Controller("rooms")
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @Roles("super-admin", "admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FilesInterceptor("files", Infinity, { fileFilter: filterFileTypes(["image/jpeg", "image/png", "image/webp"]) }))
  async createRoom(@Body() body: CreatetRoomBodyDto, @UploadedFiles() files?: File[]) {
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
  @UseInterceptors(FilesInterceptor("files", Infinity, { fileFilter: filterFileTypes(["image/jpeg", "image/png", "image/webp"]) }))
  async updateRoom(@Param(new ValidationPipe()) params: UpdateRoomParamsDto, @Body() body: UpdateRoomBodyDto, @UploadedFiles() files?: File[]) {
    return await this.roomsService.updateRoom(params.roomId, body, files)
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
  async addImagesToRoom(@Param(new ValidationPipe()) params: AddImagesToRoomParamsDto, @Body() body: AddImagesToRoomBodyDto, @UploadedFiles() files?: File[]) {
    return await this.roomsService.addImagesToRoom(params.roomId, body, files)
  }
}