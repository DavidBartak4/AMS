import { Controller, Get, Param, UseGuards, ValidationPipe, Req, Delete, Query, Body } from "@nestjs/common"
import { JwtAuthGuard } from "../auth/guards/jwt.guard"
import { UsersService } from "./users.service"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"
import { GetAdminsBodyDto, GetAdminsQueryDto } from "./dto/get.admins.dto"
import { GetUserParamsDto } from "./dto/get.user.dto"
import { DeleteUserParamsDto } from "./dto/delete.user.dto"

@Controller("users")
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("admins")
  @Roles("super-admin", "admin")
  getAdmins(@Query(new ValidationPipe({ transform: true })) query: GetAdminsQueryDto, @Body() body: GetAdminsBodyDto, @Req() req) {
    let select = "-password"
    if (!req.user.roles.includes("super-admin")) { select = `${select} -roles` }
    return this.usersService.getAdmins(body, query, select)
  }

  @Get(":userId")
  @Roles("super-admin", "admin")
  getUser(@Param(new ValidationPipe()) params: GetUserParamsDto, @Req() req) {
    let select = "-password"
    if (!req.user.roles.includes("super-admin")) { select = `${select} -roles` }
    return this.usersService.getUser(params.userId, select)
  }

  @Delete(":userId")
  @Roles("super-admin")
  deleteUser(@Param(new ValidationPipe()) params: DeleteUserParamsDto) {
    return this.usersService.deleteUser(params.userId)
  }
}