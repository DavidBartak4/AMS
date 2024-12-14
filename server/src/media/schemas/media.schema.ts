import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Types } from "mongoose"

@Schema({ collection: "media" })
export class Media {
    _id: Types.ObjectId

    __v: number

    @Prop({ required: true, enum: ["url", "file"]})
    type: string

    @Prop()
    filename?: string

    @Prop()
    location?: string

    @Prop()
    contentType?: string
}

export type MediaDocument = Media & Document
export const MediaSchema = SchemaFactory.createForClass(Media)