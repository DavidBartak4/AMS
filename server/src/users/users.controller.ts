import { Controller, Get, Param, UseGuards, ValidationPipe, Req, Delete, Query, Body } from "@nestjs/common"
import { JwtAuthGuard } from "../auth/guards/jwt.guard"
import { UsersService } from "./users.service"
import { GetUserParamsDto } from "./dto/get.user.dto"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"
import { DeleteUserParamsDto } from "./dto/delete.user.dto"
import { GetAdminsBodyDto, GetAdminsQueryDto } from "./dto/get.admins.dto"

@Controller("users")
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("user/profile")
  @Roles("super-admin", "admin")
  getProfile(@Req() req) {
    return this.usersService.getUser(req.user.id)
  }

  @Get("admins")
  @Roles("super-admin")
  getAdmins(@Query(new ValidationPipe({ transform: true })) query: GetAdminsQueryDto, @Body() body: GetAdminsBodyDto) {
    return this.usersService.getAdmins(query, body)
  }

  @Get(":userId")
  @Roles("super-admin")
  getUser(@Param(new ValidationPipe()) params: GetUserParamsDto) {
    return this.usersService.getUser(params.userId)
  }

  @Delete(":userId")
  @Roles("super-admin")
  deleteUser(@Param(new ValidationPipe()) params: DeleteUserParamsDto) {
    return this.usersService.deleteUser(params.userId)
  }
}