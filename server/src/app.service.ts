import { Injectable, OnModuleInit } from "@nestjs/common"
import { UsersService } from "./users/users.service"
import { SignupDto } from "./auth/dto/signup.dto"

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly usersService: UsersService) {}

  async onModuleInit() {
    const superAdminUsername = "super_admin"
    const superAdminPassword = "12345678"
    const superAdmin = await this.usersService.findUserByUsername(superAdminUsername)
    if (!superAdmin) {
      const SignupDto: SignupDto = {
        username: superAdminUsername,
        password: superAdminPassword,
      }
      const user = await this.usersService.createUser({...SignupDto})
      await this.usersService.addRoleToUser(user._id.toString(), "super-admin")
    }
  }
}