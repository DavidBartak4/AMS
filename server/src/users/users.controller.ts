import { Controller, Get, Param, UseGuards, ValidationPipe, Delete, Query, Body } from "@nestjs/common"
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
  async getAdmins(@Query(new ValidationPipe()) query: GetAdminsQueryDto, @Body() body: GetAdminsBodyDto) {
    return await this.usersService.getAdmins(query, body)
  }

  @Get(":userId")
  @Roles("super-admin", "admin")
  async getUser(@Param(new ValidationPipe()) params: GetUserParamsDto) {
    return await this.usersService.getUser(params.userId)
  }

  @Delete(":userId")
  @Roles("super-admin")
  async deleteUser(@Param(new ValidationPipe()) params: DeleteUserParamsDto) {
    return await this.usersService.deleteUser(params.userId)
  }
}