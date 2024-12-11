import { Controller, Post, Body, UseGuards } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { SignupDto } from "./dto/signup.dto"
import { LoginDto } from "./dto/login.dto"
import { RolesGuard } from "./guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"
import { JwtAuthGuard } from "./guards/jwt.guard"

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("admins")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("super-admin")
  signup(@Body() body: SignupDto) {
    return this.authService.signup(body)
  }

  @Post("login")
  login(@Body() body: LoginDto) {
    return this.authService.login(body)
  }
}