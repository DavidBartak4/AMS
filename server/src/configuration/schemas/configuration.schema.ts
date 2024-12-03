import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

export type ConfigDocument = Configuration & Document

@Schema()
export class Configuration {
  @Prop({ required: false, default: null })
  mailHost: string

  @Prop({ required: false, default: null })
  mailPort: number

  @Prop({ required: false, default: null })
  mailUsername: string

  @Prop({ required: false, default: null })
  mailPassword: string

  @Prop({ required: false, default: null })
  googleApiKey: string
}

export const ConfigurationSchema = SchemaFactory.createForClass(Configuration)