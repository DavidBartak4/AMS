import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

@Schema()
export class Auth {
  @Prop({ type: String })
  jwtSecret?: string
}

export type AuthDocument = Auth & Document
export const AuthSchema = SchemaFactory.createForClass(Auth)