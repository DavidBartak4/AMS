import { Controller } from "@nestjs/common"
import { JwtAuthGuard } from "../auth/guards/jwt.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"
import { RoomsService } from "./rooms.service"
import { PostRoomBodyDto } from "./dto/post.room.dto"
import { PatchRoomBodyDto } from "./dto/patch.room.dto"
import { RoomParamsDto } from "./dto/room.dto"

@Controller("rooms")
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  /*
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("super-admin", "admin")
  createRoom(@Body() body: PostRoomBodyDto) {
    return this.roomsService.createRoom(body)
  }

  @Get()
  getRooms() {
    return this.roomsService.getRooms()
  }

  @Get(":roomId")
  getRoom(@Param(new ValidationPipe()) params: RoomParamsDto) {
    return this.roomsService.getRoom(params.roomId)
  }

  @Patch(":roomId")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("super-admin", "admin")
  patchRoom(
    @Param(new ValidationPipe()) params: RoomParamsDto,
    @Body() body: PatchRoomBodyDto,
  ) {
    return this.roomsService.patchRoom(params.roomId, body)
  }

  @Delete(":roomId")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("super-admin", "admin")
  deleteRoom(@Param(new ValidationPipe()) params: RoomParamsDto) {
    return this.roomsService.deleteRoom(params.roomId)
  }
  */
}