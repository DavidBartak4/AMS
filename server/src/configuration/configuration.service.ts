import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { PatchGoogleApiKeyBodyDto } from "./dto/patch.googleApiKey.dto"
import { PatchMailConfigurationBodyDto } from "./dto/patch.mailConfiguration.dto"
import { Configuration, ConfigDocument } from "./schemas/configuration.schema"

@Injectable()
export class ConfigurationService {
  constructor(@InjectModel(Configuration.name) private readonly configModel: Model<ConfigDocument>) {}

  async getConfiguration() {
    const config = await this.configModel.findOne()
    if (!config) throw new NotFoundException("Configuration not found")
    return config
  }

  async patchMailConfiguration(dto: PatchMailConfigurationBodyDto) {
    const config = await this.configModel.findOneAndUpdate({}, dto, { new: true, upsert: true })
    if (!config) throw new NotFoundException("Configuration not found")
    // Optionally validate mail credentials
    await this.validateMailConfiguration(dto)
    return config
  }

  async patchGoogleApiKey(dto: PatchGoogleApiKeyBodyDto) {
    const { googleApiKey } = dto
    // Optionally validate API key
    const isValid = await this.validateGoogleApiKey(googleApiKey)
    if (!isValid) throw new BadRequestException("Invalid Google API key")
    return await this.configModel.findOneAndUpdate({}, dto, { new: true, upsert: true })
  }

  private async validateMailConfiguration(dto: PatchMailConfigurationBodyDto) {
    // Add validation logic for mail credentials
    if (!dto.mailHost || !dto.mailUsername || !dto.mailPassword) {
      throw new BadRequestException("Incomplete mail configuration")
    }
  }

  private async validateGoogleApiKey(apiKey: string) {
    // Add API key validation logic, e.g., by calling a Google API
    return true // Replace with real validation
  }
}