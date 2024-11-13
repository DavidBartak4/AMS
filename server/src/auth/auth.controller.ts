import { Controller, Post, Body } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { AuthSignupDto } from "./dto/auth.signup.dto"
import { AuthLoginDto } from "./dto/auth.login.dto"

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  signup(@Body() authSignupDto: AuthSignupDto) {
    return this.authService.signup(authSignupDto)
  }

  @Post("login")
  login(@Body() authLoginDto: AuthLoginDto) {
    return this.authService.login(authLoginDto)
  }
}