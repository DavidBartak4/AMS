import { Controller, Get, Patch, Body, UseGuards } from "@nestjs/common"
import { ConfigurationService } from "./configuration.service"
import { JwtAuthGuard } from "src/auth/guards/jwt.guard"
import { RolesGuard } from "src/auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"
import { UpdateMailConfigurationBodyDto } from "./dto/update.mail.configuration.dto"

@Controller("configuration")
@Roles("super-admin", "admin")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ConfigurationController {
  constructor(private readonly configurationService: ConfigurationService) {}

  @Get()
  async getConfiguration() {
    return await this.configurationService.getConfiguration()
  }

  @Patch()
  async updateMailConfig(@Body() body: UpdateMailConfigurationBodyDto) {
    return await this.configurationService.updateMailConfiguration(body)
  }
}