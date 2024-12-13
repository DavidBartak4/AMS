import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

@Schema()
export class Auth {
  @Prop({ required: false, default: null })
  jwtSecret: string
}

export type AuthDocument = Auth & Document
export const AuthSchema = SchemaFactory.createForClass(Auth)