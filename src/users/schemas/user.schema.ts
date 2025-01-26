import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument, PaginateModel, UpdateQuery } from "mongoose"
import * as mongoosePaginate from "mongoose-paginate-v2"
import * as bcrypt from "bcryptjs"

@Schema()
export class User {
    @Prop({ required: true, unique: true })
    username: string

    @Prop({ required: true })
    password: string

    @Prop({ required: true, default: "admin" })
    role: string
}

export type UserDocument = HydratedDocument<User>
export const UserSchema = SchemaFactory.createForClass(User)
export type UserModel = PaginateModel<UserDocument>
UserSchema.plugin(mongoosePaginate)

async function hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}

UserSchema.pre("save", async function(next) {
    if (this.isModified("password")) {
        this.password = await hashPassword(this.password)
    }
    next()
})

UserSchema.pre("findOneAndUpdate", async function(next) {
    const update: UpdateQuery<UserDocument> = this.getUpdate()
    if (update.password) {
        update.password = await hashPassword(update.password)
        this.setUpdate(update)
    }
    next()
})