import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument, PaginateModel } from "mongoose"
import * as mongoosePaginate from "mongoose-paginate-v2"
import { Price } from "src/common/schemas/price.schema"

@Schema()
export class Room {
    id: string

    @Prop({ default: null })
    name: string | null

    @Prop({ default: null })
    roomType: string | null

    @Prop({ default: null })
    description: string | null

    @Prop({ default: null })
    mainImageId: string | null

    @Prop({ default: [] })
    imageIds: string[]

    @Prop({ type: Price })
    price: Price

    @Prop({default: null})
    pricing: string

    @Prop({ default: null, unique: true })
    roomCode: string | null

    @Prop({ default: null })
    capacity: number | null

    @Prop({ default: [] })
    attributeIds: string[]
}

export type RoomDocument = HydratedDocument<Room>
export const RoomSchema = SchemaFactory.createForClass(Room)
export type RoomModel = PaginateModel<RoomDocument>
RoomSchema.plugin(mongoosePaginate)