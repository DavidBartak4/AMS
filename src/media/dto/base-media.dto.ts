import { ApiProperty } from "@nestjs/swagger"
import { Expose, Transform } from "class-transformer"
import { IsIn } from "class-validator"
import { File } from "multer"

export class BaseMediaDto {
    @ApiProperty()
    @Expose()
    @Transform(function({ obj }) {
        if (obj.type === "file") { return `/media/${obj.id}/stream` }
        return obj.location
    })
    location: string

    @ApiProperty()
    file?: File

    @ApiProperty({ enum: ["url", "file"] })
    @Expose()
    @IsIn(["url", "file"])
    type: string
}