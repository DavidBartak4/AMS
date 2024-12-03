import { Controller, Get, Patch, Body } from "@nestjs/common"
import { ConfigurationService } from "./configuration.service"
import { PatchMailConfigurationBodyDto } from "./dto/patch.mailConfiguration.dto"
import { PatchGoogleApiKeyBodyDto } from "./dto/patch.googleApiKey.dto"

@Controller("config")
export class ConfigurationController {
  constructor(private readonly configurationService: ConfigurationService) {}

  @Get()
  async getConfiguration() {
    return await this.configurationService.getConfiguration()
  }

  @Patch("mail")
  async updateMailConfig(@Body() dto: PatchMailConfigurationBodyDto) {
    return await this.configurationService.patchMailConfiguration(dto)
  }

  @Patch("google-api-key")
  async updateGoogleApiKey(@Body() dto: PatchGoogleApiKeyBodyDto) {
    return await this.configurationService.patchGoogleApiKey(dto)
  }
}