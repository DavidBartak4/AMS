import { Controller, Post, Body, UseGuards } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { SignupBodyDto } from "./dto/signup.dto"
import { LoginBodyDto } from "./dto/login.dto"
import { RolesGuard } from "./guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"
import { JwtAuthGuard } from "./guards/jwt.guard"

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
}