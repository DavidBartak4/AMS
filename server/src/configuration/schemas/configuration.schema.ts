import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

@Schema()
export class Configuration {
  @Prop()
  mailHost: string

  @Prop()
  mailPort: number

  @Prop()
  mailUsername: string

  @Prop()
  mailPassword: string
}

export type ConfigurationDocument = Configuration & Document
export const ConfigurationSchema = SchemaFactory.createForClass(Configuration)