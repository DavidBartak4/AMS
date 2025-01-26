import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument, PaginateModel } from "mongoose"
import * as mongoosePaginate from "mongoose-paginate-v2"

@Schema()
export class Attribute {
    id: string

    @Prop({ required: true, unique: true })
    name: string

    @Prop({ default: null })
    description: string | null

    @Prop({ default: null })
    imageId: string | null
}

export type AttributeDocument = HydratedDocument<Attribute>
export const AttributeSchema = SchemaFactory.createForClass(Attribute)
export type AttributeModel = PaginateModel<AttributeDocument>
AttributeSchema.plugin(mongoosePaginate)