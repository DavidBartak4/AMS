import { Injectable } from "@nestjs/common"
import { InjectConnection, InjectModel } from "@nestjs/mongoose"
import { Mail, Settings, SettingsModel } from "./schemas/settings.schema"
import { HandleDuplicateKeyMongooseError } from "src/common/decorators/handle-duplicate-key-mongoose-error.decorator"
import { MailEAUTHException, MailECONNECTIONException, MailEDNSException, MailETIMEDOUTException, SettingsErrorMessages, UnexpectedMailErrorException } from "./settings.exceptions"
import { CreateSettingsDto } from "./dto/create-settings.dto"
import { UpdateSettingsDto } from "./dto/update-settings.dto"
import { SettingsResponseDto } from "./dto/settings-response.dto"
import { plainToInstance } from "class-transformer"
import * as nodeMailer from "nodemailer"
import { Connection } from "mongoose"

@Injectable()
@HandleDuplicateKeyMongooseError("_id", SettingsErrorMessages.SETTINGS_EXIST)
export class SettingsService {
    constructor(@InjectModel(Settings.name) private readonly settingsModel: SettingsModel, @InjectConnection() private readonly connection: Connection) {}

    async createSettings(createSettingsDto: CreateSettingsDto): Promise<SettingsResponseDto> {
        const session = await this.connection.startSession()
        session.startTransaction()
        try {
            const settingsDocument = await this.settingsModel.create([createSettingsDto], {session})
            const settings = settingsDocument[0]
            await this.verifyMail(settings.mail)
            await session.commitTransaction()
            return plainToInstance(SettingsResponseDto, settings, { excludeExtraneousValues: true })
        } catch (error) {
            await session.abortTransaction()
            throw error
        } finally {
            session.endSession()
        }
    }

    async getSettings(): Promise<SettingsResponseDto> {
        const settingsDocument: any = await this.settingsModel.findOne().exec()
        return plainToInstance(SettingsResponseDto, settingsDocument, { excludeExtraneousValues: true })
    }

    async updateSettings(updateSettingsDto: UpdateSettingsDto): Promise<SettingsResponseDto> {
        const session = await this.connection.startSession()
        session.startTransaction()
        try {
            const settingsDocument = await this.settingsModel.findOneAndUpdate({}, updateSettingsDto, { new: true, session }).exec()
            await this.verifyMail(settingsDocument.mail)
            await session.commitTransaction()
            return plainToInstance(SettingsResponseDto, settingsDocument, { excludeExtraneousValues: true })
        } catch (error) {
            await session.abortTransaction()
            throw error
        } finally {
            session.endSession()
        }
    }

    async verifyMail(mail: Mail) {
        if (this.getIsMailValid(mail)) {
            try {
                await nodeMailer.createTransport({
                    connectionTimeout: 10000,
                    host: `smtp.${mail.provider}`,
                    port: mail.port,
                    secure: mail.port === 465,
                    auth: {
                        user: mail.auth.username,
                        pass: mail.auth.password
                    }
                }).verify()
            } catch (error) {
                if (error.code == "EDNS") {
                    throw new MailEDNSException()
                }
                if (error.code === "EAUTH") {
                    throw new MailEAUTHException()
                }
                if (error.code === "ETIMEDOUT") {
                    throw new MailETIMEDOUTException()
                }
                if (error.code === "ECONNECTION") {
                    throw new MailECONNECTIONException()
                }
                throw new UnexpectedMailErrorException()
            }
        }
    }

    private getIsMailValid(mail: Mail): boolean {
        const { port, provider, auth } = mail
        if (!port || !provider || !auth) return false
        const { username, password } = auth
        if (!username || !password) return false
        return true
    }
}