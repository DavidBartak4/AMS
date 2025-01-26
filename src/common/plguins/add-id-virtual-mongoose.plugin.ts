import { Schema } from "mongoose"

export function addIdVirtual(schema: Schema) {
    schema.virtual("id").get(function () { return this._id?.toString() }).set(function(value: string) {
        return this._id = value
    })
    schema.set("toJSON", { 
        virtuals: true,
        transform: function(_, ret) {
            delete ret._id
        }
     })
    schema.set("toObject", { 
        virtuals: true,
        transform: function(_, ret) {
            delete ret._id
        }
    })
}