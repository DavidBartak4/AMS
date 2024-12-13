import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { Configuration, ConfigurationDocument } from "./schemas/configuration.schema"
import * as nodeMailer from "nodemailer"
import { UpdateMailConfigurationBodyDto } from "./dto/update.mail.configuration.dto"

@Injectable()
export class ConfigurationService {
  constructor(@InjectModel(Configuration.name) private readonly configurationModel: Model<ConfigurationDocument>) {}

  async getConfiguration(): Promise<Configuration> {
    const configuration = await this.configurationModel.findOne()
    if (!configuration) { throw new NotFoundException("Configuration not found") }
    return configuration
  }

  async updateMailConfiguration(body: UpdateMailConfigurationBodyDto): Promise<Configuration> {
    const configuration = await this.configurationModel.findOne()
    body.mailUsername = body.mailUsername || configuration && configuration.mailUsername || undefined
    body.mailPassword = body.mailPassword || configuration && configuration.mailPassword || undefined
    if (body.mailPassword && body.mailUsername) {
      await this.verifyMail({
        mailHost: body.mailHost || configuration && configuration.mailHost || undefined,
        mailPort: body.mailPort || configuration && configuration.mailPort || undefined,
        mailUsername: body.mailUsername,
        mailPassword: body.mailPassword
      })
    }
    return await this.configurationModel.findOneAndUpdate({}, body, { new: true, upsert: true })
  }

  private async verifyMail(mailConfiguration: UpdateMailConfigurationBodyDto): Promise<void> {
    try {
      await nodeMailer.createTransport({
        host: mailConfiguration.mailHost,
        port: mailConfiguration.mailPort|| 587,
        secure: mailConfiguration.mailPort === 465,
        auth: { 
          user: mailConfiguration.mailUsername, 
          pass: mailConfiguration.mailPassword
        },
        connectionTimeout: 10000
      }).verify()
    } catch (err) {
      throw new BadRequestException("Mail configuration verification failed")
    }
  }
}