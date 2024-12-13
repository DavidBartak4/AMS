import { Controller, Get, Patch, Body, UseGuards } from "@nestjs/common"
import { ConfigurationService } from "./configuration.service"
import { PatchMailConfigurationBodyDto } from "./dto/patch.mailConfiguration.dto"
import { JwtAuthGuard } from "src/auth/guards/jwt.guard"
import { RolesGuard } from "src/auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("super-admin", "admin")
@Controller("configuration")
export class ConfigurationController {
  constructor(private readonly configurationService: ConfigurationService) {}

  /*
  @Get()
  async getConfiguration() {
    return await this.configurationService.getConfiguration()
  }

  @Patch("mail")
  async updateMailConfig(@Body() body: PatchMailConfigurationBodyDto) {
    return await this.configurationService.patchMailConfiguration(body)
  }
  */
}