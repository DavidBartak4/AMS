import { Schema } from "mongoose"

export function enableIdQuery(schema: Schema) {
    schema.pre("find", function () {
        if (this.getQuery().id) {
            this.setQuery({ ...this.getQuery(), _id: this.getQuery().id })
            delete this.getQuery().id
        }
    })

    schema.pre("findOne", function () {
        if (this.getQuery().id) {
            this.setQuery({ ...this.getQuery(), _id: this.getQuery().id })
            delete this.getQuery().id
        }
    })

    schema.pre("findOneAndUpdate", function () {
        if (this.getQuery().id) {
            this.setQuery({ ...this.getQuery(), _id: this.getQuery().id })
            delete this.getQuery().id
        }
    })

    schema.pre("findOneAndDelete", function () {
        if (this.getQuery().id) {
            this.setQuery({ ...this.getQuery(), _id: this.getQuery().id })
            delete this.getQuery().id
        }
    })
}