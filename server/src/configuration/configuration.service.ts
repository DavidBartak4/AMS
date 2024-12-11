import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { PatchMailConfigurationBodyDto } from "./dto/patch.mailConfiguration.dto"
import { Configuration, ConfigurationDocument } from "./schemas/configuration.schema"
import * as nodeMailer from "nodemailer"

@Injectable()
export class ConfigurationService {
  constructor(@InjectModel(Configuration.name) private readonly configurationModel: Model<ConfigurationDocument>) {}

  async getConfiguration() {
    const configuration = await this.configurationModel.findOne()
    if (!configuration) { throw new NotFoundException("Configuration not found") }
    return configuration
  }

  async patchMailConfiguration(dto: PatchMailConfigurationBodyDto) {
    if (dto.mailUsername && dto.mailPassword) {
      await this.validateMailConfiguration(dto)
    }
    const config = await this.configurationModel.findOneAndUpdate({}, dto, { new: true, upsert: true })
    if (!config) { throw new NotFoundException("Configuration not found") }
    return config
  }

  private async validateMailConfiguration(dto: PatchMailConfigurationBodyDto) {
    let configuration
    try {
      configuration = await this.getConfiguration()
    } catch (err) {}
    try {
      const transporter = nodeMailer.createTransport({
        host: dto.mailHost || configuration && configuration.mailHost,
        port: dto.mailPort || 587,
        secure: dto.mailPort === 465,
        auth: { 
          user: dto.mailUsername || configuration && configuration.mailUsername, 
          pass: dto.mailPassword || configuration && configuration.mailPassword
        },
        connectionTimeout: 3000,
      })
      await transporter.verify()
    } catch (error) {
      throw new BadRequestException("Mail credentials verification failed.")
    }
  }
}