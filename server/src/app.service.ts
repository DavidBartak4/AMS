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
    await this.setupAppConfig()
    await this.setupSuperAdmin()
    await this.setupConfiguration()
  }

  private async setupAppConfig() {
    try {
      const res = await fetch(`http://localhost:${this.configuration.port}`)
      const data = await res.json()
      const { protocol, host } = data
      const url = `${protocol}://${host}`
      this.appConfigService.set("url", url)
    } catch (err) {}
  }

  private async setupConfiguration() {
    try { await this.configurationService.createConfiguration() } catch (err) {}
  }

  private async setupSuperAdmin() {
    const body: LoginBodyDto = { username: "super_admin", password: "12345678"}
    try {
      await this.usersService.findUser({ username: body.username })
    } catch (err) {
      const signup = await this.authService.signup(body)
      await this.usersService.addRoleToUser(signup.user._id.toString(), "super-admin")
    }
  }
}