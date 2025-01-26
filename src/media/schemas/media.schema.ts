import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument, Model } from "mongoose"

@Schema()
export class Media {
    id: string

    @Prop({ required: true })
    type: string

    @Prop({ default: null })
    filename: string | null

    @Prop({ default: null })
    location: string | null

    @Prop({ default: null })
    contentType: string | null
}

export type MediaDocument = HydratedDocument<Media>
export const MediaSchema = SchemaFactory.createForClass(Media)
export type MediaModel = Model<MediaDocument>