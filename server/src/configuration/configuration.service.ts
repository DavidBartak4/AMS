import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { Configuration, ConfigurationDocument, Mail } from "./schemas/configuration.schema"
import * as nodeMailer from "nodemailer"
import { UpdateConfigurationBodyDto } from "./dto/update.configuration.dto"
import { CreateConfigurationBodyDto } from "./dto/create.configuration.dto copy"
import { ConfigurationAlreadyExistException, ConfigurationNotFoundException, MailVerificationFailedException } from "./configuration.exceptions"

@Injectable()
export class ConfigurationService {
  constructor(@InjectModel(Configuration.name) readonly configurationModel: Model<ConfigurationDocument>) {}

  async createConfiguration(body: CreateConfigurationBodyDto = {}): Promise<Configuration> {
    const configuration = await this.configurationModel.findOne().exec()
    if (configuration) { throw new ConfigurationAlreadyExistException }
    if (body?.mail?.username && body?.mail?.password) { await this.verifyMail(body.mail) }
    return await this.configurationModel.create(body)
  }

  async getConfiguration(): Promise<Configuration> {
    const configuration = await this.configurationModel.findOne().exec()
    if (!configuration) { throw new ConfigurationNotFoundException }
    return configuration
  }

  async updateConfiguration(body: UpdateConfigurationBodyDto): Promise<Configuration> {
    const configuration = await this.configurationModel.findOne().exec()
    if (!configuration) { throw new ConfigurationNotFoundException }
    const mailHost = body?.mail?.mailHost
    const mailPort = body?.mail?.mailPort
    const mailUsername = body?.mail?.mailUsername
    const mailPassword = body?.mail?.mailPassword
    const mailUseCompanyName = body?.mail?.useCompanyName
    const companyName = body?.companyName
    if (mailHost) { configuration.mail.host = mailHost }
    if (mailPort) { configuration.mail.port = mailPort }
    if (mailUsername) { configuration.mail.username = mailUsername }
    if (mailPassword) { configuration.mail.password = mailPassword }
    if (mailUseCompanyName) { configuration.mail.useCompanyName = mailUseCompanyName }
    if (companyName) { configuration.companyName = companyName }
    if (configuration.mail.username && configuration.mail.password) { await this.verifyMail(configuration.mail) }
    await configuration.save()
    return configuration
  }

  private async verifyMail(mail: any): Promise<void> {
    try {
      await nodeMailer.createTransport({
        host: mail.host,
        port: mail.port || 587,
        secure: mail.port === 465,
        auth: { 
          user: mail.username, 
          pass: mail.password
        },
        connectionTimeout: 10000
      }).verify()
    } catch (err) { throw new MailVerificationFailedException }
  }
}