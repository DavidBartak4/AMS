import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { Configuration, ConfigurationDocument } from "./schemas/configuration.schema"
import * as nodeMailer from "nodemailer"
import { UpdateConfigurationBodyDto } from "./dto/update.configuration.dto"
import { CreateConfigurationBodyDto } from "./dto/create.configuration.dto copy"

@Injectable()
export class ConfigurationService {
  constructor(@InjectModel(Configuration.name) private readonly configurationModel: Model<ConfigurationDocument>) {}

  async createConfiguration(body: CreateConfigurationBodyDto = {}): Promise<Configuration> {
    const configuration = await this.configurationModel.findOne()
    if (configuration) { throw new BadRequestException("Configuration already exists") }
    if (body.mail?.mailUsername && body.mail?.mailPassword) { await this.verifyMail(body.mail) }
    const createdConfiguration = new this.configurationModel(body)
    return await createdConfiguration.save()
  }

  async getConfiguration(): Promise<Configuration> {
    const configuration = await this.configurationModel.findOne()
    if (!configuration) { throw new NotFoundException("Configuration not found") }
    return configuration
  }

  async updateConfiguration(body: UpdateConfigurationBodyDto): Promise<Configuration> {
    const configuration = await this.configurationModel.findOne()
    const mail = {
      mailHost: body.mail?.mailHost ?? configuration?.mail.mailHost,
      mailPort: body.mail?.mailPort ?? configuration?.mail.mailPort,
      mailUsername: body.mail?.mailUsername ?? configuration?.mail.mailUsername,
      mailPassword: body.mail?.mailPassword ?? configuration?.mail.mailPassword,
      useCompanyName: body.mail?.useCompanyName ?? configuration?.mail.useCompanyName ?? true,
    }
    if (mail.mailUsername && mail.mailPassword) { await this.verifyMail(mail) }
    const updatePayload = {
      mail,
      companyName: body.companyName ?? configuration?.companyName ?? "example company",
    }
    return await this.configurationModel.findOneAndUpdate({}, updatePayload, { new: true, upsert: true })
  }

  private async verifyMail(mailConfiguration: any): Promise<void> {
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