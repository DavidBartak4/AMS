import { Injectable } from "@nestjs/common"
import { UsersService } from "./users/users.service"
import { CreateUserDto } from "./users/dto/create-user.dto"
import { SettingsService } from "./settings/settings.service"

@Injectable()
export class AppService {
    constructor(private readonly usersService: UsersService, private readonly settingsService: SettingsService) {}

    async setup() {
        await this.setupSuperAdmin()
        await this.setupAppSettings()
    }

    private async setupSuperAdmin() {
        const createUserDto: CreateUserDto = { username: "super_admin", password: "12345678", role: "super-admin" }
        await this.usersService.createUser(createUserDto).catch(function() {})
    }

    private async setupAppSettings() {
        await this.settingsService.createSettings({}).catch(function() {})
    }
}