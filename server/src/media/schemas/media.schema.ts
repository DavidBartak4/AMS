import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"
import { ObjectId } from "mongodb"

@Schema({ collection: "media" })
export class Media {
    @Prop()
    _id?: ObjectId

    @Prop({ required: true })
    filename: string

    @Prop({ required: true })
    contentType: string
}

export type MediaDocument = Media & Document
export const MediaSchema = SchemaFactory.createForClass(Media)