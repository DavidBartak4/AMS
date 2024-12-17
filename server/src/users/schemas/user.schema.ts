import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, PaginateModel, Types } from "mongoose"
import * as mongoosePaginate from "mongoose-paginate-v2"

@Schema({ timestamps: true })
export class User {
  _id: Types.ObjectId

  @Prop({ type: String, unique: true, required: true }) //minlength: 3, maxlength: 20 })
  username: string

  @Prop({ type: String, required: true })
  password: string

  @Prop({ type: [String], enum: ["admin", "super-admin"], default: ["admin"] })
  roles: string[]
}

export type UserDocument = User & Document
export const UserSchema = SchemaFactory.createForClass(User)
export type UserModel = PaginateModel<UserDocument>
UserSchema.plugin(mongoosePaginate)