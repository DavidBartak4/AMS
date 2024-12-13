import { Controller, Post, Body, UseGuards, Get, Patch, Req } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { SignupBodyDto } from "./dto/signup.dto"
import { LoginBodyDto } from "./dto/login.dto"
import { RolesGuard } from "./guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"
import { JwtAuthGuard } from "./guards/jwt.guard"
import { UsersService } from "src/users/users.service"
import { UpdateUserCredentialsBodyDto } from "./dto/update.userCredentials.dto"

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly usersService: UsersService) {}

  @Post("admins")
  @Roles("super-admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  signup(@Body() body: SignupBodyDto) {
    return this.authService.signup(body)
  }

  @Post("login")
  login(@Body() body: LoginBodyDto) {
    return this.authService.login(body)
  }

  @Get("account")
  @UseGuards(JwtAuthGuard)
  getAccount(@Req() req) {
    return this.usersService.getUser(req.user.id, "-password")
  }
  
  @Patch("account/credentials")
  @UseGuards(JwtAuthGuard)
  updateCredentials(@Req() req, @Body() body: UpdateUserCredentialsBodyDto) {
    return this.authService.updateCredentials(req.user.id, body)
  }
}