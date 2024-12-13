import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Types } from "mongoose"

@Schema({ collection: "media" })
export class Media {
    _id: Types.ObjectId

    @Prop({ required: true, enum: ["url", "file"]})
    type: "url" | "file"

    @Prop()
    filename?: string

    @Prop()
    url?: string

    @Prop()
    contentType?: string
}

export type MediaDocument = Media & Document
export const MediaSchema = SchemaFactory.createForClass(Media)