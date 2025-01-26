import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Type } from "class-transformer"
import { HydratedDocument, Model } from "mongoose"
import { SettingsDefaults } from "../settings.config"

@Schema({ _id: false })
class MailAuth {
    @Prop({ default: null })
    username: string | null

    @Prop({ default: null })
    password: string | null
}

@Schema({ _id: false })
export class Mail {
    @Prop({ default: SettingsDefaults.PORT })
    port: number | null

    @Prop({ default: null })
    provider: string | null

    @Prop({ type: MailAuth, default: {} })
    @Type(function() { return MailAuth })
    auth: MailAuth

    @Prop({ default: false })
    useName: boolean
}

@Schema()
export class Settings {
    @Prop({ default: "singleton"})
    _id: string

    @Prop({ default: null })
    name: string | null

    @Prop({ type: Mail, default: {} })
    @Type(function() { return Mail })
    mail: Mail
}

export type SettingsDocument = HydratedDocument<Settings>
export const SettingsSchema = SchemaFactory.createForClass(Settings)
export type SettingsModel = Model<SettingsDocument>