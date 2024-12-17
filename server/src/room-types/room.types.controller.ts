import { Controller, Post, Body, UseGuards, Get, Patch, UseInterceptors, Param, ValidationPipe, UploadedFiles, Query, Delete } from "@nestjs/common"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"
import { JwtAuthGuard } from "../auth/guards/jwt.guard"
import { filterFileTypes } from "src/common/helpers/fileInterceptor.helpers"
import { FilesInterceptor } from "@nestjs/platform-express"
import { CreateRoomTypeBodyDto } from "./dto/create.room.type.dto"
import { RoomsTypesService } from "./room.types.service"
import { GetRoomTypesBodyDto, GetRoomTypesQueryDto } from "./dto/get.room.types.dto"
import { GetRoomTypeParamsDto } from "./dto/get.room.type.dto"
import { UpdateRoomTypeBodyDto, UpdateRoomTypeParamsDto } from "./dto/update.room.type.dto"
import { DeleteRoomTypeParamsDto } from "./dto/delete.room.type.dto"

@Controller("room-types")
export class RoomTypesController {
  constructor(private readonly roomsTypeService: RoomsTypesService) {}

  /*
  @Post()
  @Roles("super-admin", "admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FilesInterceptor("file", Infinity, { fileFilter: filterFileTypes(["image/jpeg", "image/png", "image/webp"]) }))
  async createRoomType(@Body() body: CreateRoomTypeBodyDto, @UploadedFiles() files: File[]) {
    return await this.roomsTypeService.createRoomType(body, files)
  }

  @Get()
  @Roles("super-admin", "admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getRoomTypes(@Query() query: GetRoomTypesQueryDto, @Body() body: GetRoomTypesBodyDto) {
    return await this.roomsTypeService.getRoomTypes(body, query)
  }

  @Get(":roomTypeId")
  @Roles("super-admin", "admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getRoomType(@Param(new ValidationPipe()) params: GetRoomTypeParamsDto) {
    return await this.roomsTypeService.getRoomType(params.roomTypeId)
  }

  @Patch(":roomTypeId")
  @Roles("super-admin", "admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FilesInterceptor("file", Infinity, { fileFilter: filterFileTypes(["image/jpeg", "image/png", "image/webp"]) }))
  async updateRoomType(@Param(new ValidationPipe()) params: UpdateRoomTypeParamsDto, @Body() body: UpdateRoomTypeBodyDto, @UploadedFiles() files: File[]) {
    return await this.roomsTypeService.updateRoomType(params.roomTypeId, body, files)
  }

  @Delete(":roomTypeId")
  @Roles("super-admin", "admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteRoomType(@Param(new ValidationPipe()) params: DeleteRoomTypeParamsDto) {
    return await this.roomsTypeService.deleteRoomType(params.roomTypeId)
  }
    */
}