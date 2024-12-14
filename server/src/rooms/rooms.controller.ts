import { Controller, Post, UseGuards } from "@nestjs/common"
import { JwtAuthGuard } from "../auth/guards/jwt.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"
import { RoomsService } from "./rooms.service"
import { CreatetRoomBodyDto } from "./dto/create.room.dto"

@Controller("rooms")
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @Roles("super-admin", "admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createRoom(body: CreatetRoomBodyDto) {
    return this.roomsService.createRoom(body)
  }
}