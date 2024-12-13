import { Injectable, OnModuleInit } from "@nestjs/common"
import { AuthService } from "./auth/auth.service"
import { UsersService } from "./users/users.service"
import { LoginBodyDto } from "./auth/dto/login.dto"

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly usersService: UsersService, private readonly authService: AuthService) {}

  async onModuleInit() {
    const body: LoginBodyDto = { username: "super_admin", password: "12345678"}
    try {
      await this.usersService.findUser({ username: body.username })
    } catch (err) {
      const signup = await this.authService.signup(body)
      await this.usersService.addRoleToUser(signup.user._id.toString(), "super-admin")
    }
  }
}