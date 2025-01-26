import { IsMongoId } from "class-validator"

export class MediaParamsDto {
    @IsMongoId()
    mediaId: string
}