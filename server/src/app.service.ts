import { Injectable } from "@nestjs/common"
import { AuthService } from "./auth/auth.service"
import { UsersService } from "./users/users.service"
import { LoginBodyDto } from "./auth/dto/login.dto"
import { ConfigurationService } from "./configuration/configuration.service"
import { ConfigService as AppConfigService } from "@nestjs/config"

@Injectable()
export class AppService {
  private configuration: any
  constructor(private readonly usersService: UsersService, private readonly authService: AuthService, private readonly configurationService: ConfigurationService, private readonly appConfigService: AppConfigService) {}

  async setupApp(configuration: any) {
    this.configuration = configuration
    this.setupAppConfig()
    await this.setupSuperAdmin()
    await this.setupConfiguration()
  }

  private setupAppConfig() { this.appConfigService.set("url", this.configuration.url) }

  private async setupConfiguration() { 
    const configuration = await this.configurationService.configurationModel.findOne().exec()
    if (!configuration) { await this.configurationService.createConfiguration() }
  }

  private async setupSuperAdmin() {
    const body: LoginBodyDto = { username: "super_admin", password: "12345678"}
    const user = await this.usersService.userModel.findOne({ username: body.username }).exec()
    if (!user) {
      const signup = await this.authService.signup(body)
      await this.usersService.addRoleToUser(signup.user._id.toString(), "super-admin")
    }
  }
}