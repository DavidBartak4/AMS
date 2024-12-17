import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Types } from "mongoose"

@Schema({ collection: "media" })
export class Media {
    _id: Types.ObjectId
    __v: number

    @Prop({ type: String, required: true, enum: ["url", "file"]})
    type: string

    @Prop({ type: String })
    filename?: string

    @Prop({ type: String })
    location?: string

    @Prop({ type: String })
    contentType?: string
}

export type MediaDocument = Media & Document
export const MediaSchema = SchemaFactory.createForClass(Media)