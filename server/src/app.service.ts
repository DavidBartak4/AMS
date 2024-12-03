import { Injectable, OnModuleInit } from "@nestjs/common"
import { UsersService } from "./users/users.service"
import { SignupDto } from "./auth/dto/signup.dto"
import { error } from "console"

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly usersService: UsersService) {}

  async onModuleInit() {
    const superAdminUsername = "super_admin"
    const superAdminPassword = "12345678"
    if (!superAdminUsername || !superAdminPassword) {
      throw new error(
        "super admin .env default login details are not specified",
      )
    }
    const superAdmin = await this.usersService.findOne(superAdminUsername)
    if (!superAdmin) {
      const SignupDto: SignupDto = {
        username: superAdminUsername,
        password: superAdminPassword,
      }
      const user = await this.usersService.create({
        ...SignupDto,
      })
      await this.usersService.addRole(user._id.toString(), "super-admin")
    }
  }
}
