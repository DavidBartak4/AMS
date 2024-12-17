import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument } from "mongoose"

@Schema({ _id: false })
export class Mail {
  @Prop({ type: String })
  host?: string

  @Prop({ type: Number })
  port?: number

  @Prop({ type: String })
  username?: string

  @Prop({ type: String })
  password?: string

  @Prop({ required: true, default: true })
  useCompanyName: boolean
}

@Schema()
export class Configuration {
  @Prop({ type: Mail, default: { useCompanyName: true } })
  mail: Mail

  @Prop({ type: String, default: "example company" })
  companyName?: string
}

export type ConfigurationDocument = HydratedDocument<Configuration>
export const ConfigurationSchema = SchemaFactory.createForClass(Configuration)