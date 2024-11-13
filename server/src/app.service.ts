import { Injectable, OnModuleInit } from "@nestjs/common"
import * as bcrypt from "bcrypt"
import { UsersService } from "./users/users.service"
import { AuthSignupDto } from "./auth/dto/auth.signup.dto"

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly usersService: UsersService) {}

  async onModuleInit() {
    const superAdminUsername = process.env.SUPER_ADMIN_USERNAME || "super_admin"
    const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || "123456"

    const superAdmin = await this.usersService.findOne(superAdminUsername)
    if (!superAdmin) {
      const hashedPassword = await bcrypt.hash(superAdminPassword, 10)
      const authSignupDto: AuthSignupDto = {
        username: superAdminUsername,
        password: hashedPassword,
      }
      await this.usersService.create({
        ...authSignupDto,
        roles: ["super-admin"],
      })
    }
  }
}