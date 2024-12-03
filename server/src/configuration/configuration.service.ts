import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { PatchMailConfigurationBodyDto } from "./dto/patch.mailConfiguration.dto"
import { Configuration, ConfigDocument } from "./schemas/configuration.schema"
import * as nodeMailer from "nodemailer"

@Injectable()
export class ConfigurationService {
  constructor(
    @InjectModel(Configuration.name)
    private readonly configurationModel: Model<ConfigDocument>,
  ) {}

  async getConfiguration() {
    const config = await this.configurationModel.findOne()
    if (!config) throw new NotFoundException("Configuration not found")
    return config
  }

  async patchMailConfiguration(dto: PatchMailConfigurationBodyDto) {
    await this.validateMailConfiguration(dto)
    const config = await this.configurationModel.findOneAndUpdate({}, dto, {
      new: true,
      upsert: true,
    })
    if (!config) throw new NotFoundException("Configuration not found")
    return config
  }

  private async validateMailConfiguration(dto: PatchMailConfigurationBodyDto) {
    const { mailHost, mailPort, mailUsername, mailPassword } = dto
    if (!mailHost || !mailUsername || !mailPassword) {
      throw new BadRequestException("Incomplete mail configuration")
    }
    try {
      const transporter = nodeMailer.createTransport({
        host: mailHost,
        port: mailPort || 587,
        secure: mailPort === 465,
        auth: {
          user: mailUsername,
          pass: mailPassword,
        },
        connectionTimeout: 10000,
      })
      await transporter.verify()
    } catch (error) {
      throw new BadRequestException("Invalid mail credentials or configuration")
    }
  }
}