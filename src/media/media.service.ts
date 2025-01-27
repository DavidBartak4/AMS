import { Injectable } from "@nestjs/common"
import { InjectConnection, InjectModel } from "@nestjs/mongoose"
import { Media, MediaDocument, MediaModel } from "./schemas/media.schema"
import { GridFSBucket, GridFSBucketReadStream, ObjectId } from "mongodb"
import { File } from "multer"
import { CreateMediaDto } from "./dto/create-media.dto"
import { MediaCreateTypeConflict, MediaHasNoStreamException, MediaNotFoundException, MediaUploadFailedException } from "./media.exceptions"
import { Connection } from "mongoose"
import { plainToInstance } from "class-transformer"
import { MediaResponseDto } from "./dto/media-response.dto"
import { EventEmitter2 } from "@nestjs/event-emitter"

@Injectable()
export class MediaService {
    private bucket: GridFSBucket
    constructor(
        @InjectModel(Media.name) private readonly mediaModel: MediaModel,
        @InjectConnection() private readonly connection: Connection,
        private readonly eventEmitter: EventEmitter2
    ) {
        this.bucket = new GridFSBucket(this.connection.db, { bucketName: Media.name.toLocaleLowerCase() })
    }

    async createMedia(createMediaDto: CreateMediaDto, session?: any): Promise<MediaResponseDto> {
        if (createMediaDto.url && createMediaDto.file) {
            throw new MediaCreateTypeConflict()
        }
        if (createMediaDto.url) {
            return await this.createMediaByUrl(createMediaDto.url, session)
        }
        if (createMediaDto.file) {
            return await this.createMediaByFile(createMediaDto.file, session)
        }
    }

    private async createMediaByUrl(url: string, session?: any): Promise<MediaResponseDto> {
        const mediaDocument = await this.mediaModel.create([{ type: "url", location: url }], { session })
        return plainToInstance(MediaResponseDto, mediaDocument[0], { excludeExtraneousValues: true })
    }

    private async createMediaByFile(file: File, session?: any): Promise<MediaResponseDto> {
        const mediaDocument: MediaDocument = await new Promise(function(resolve, reject) {
            const mediaFileDocument = this.bucket.openUploadStream(file.originalname, { contentType: file.mimetype })
            mediaFileDocument.end(file.buffer)
            mediaFileDocument.on("finish", async function () {
                const mediaDocument = await this.mediaModel.create([{
                    id: mediaFileDocument.id,
                    type: "file",
                    filename: file.originalname,
                    contentType: file.mimetype
                }], {session})
                resolve(mediaDocument[0])
            }.bind(this))
            mediaFileDocument.on("error", function() {
                reject(new MediaUploadFailedException())
            })
        }.bind(this))
        return plainToInstance(MediaResponseDto, mediaDocument, { excludeExtraneousValues: true })
    }

    async getMedia(mediaId: string): Promise<MediaResponseDto> {
        const mediaDocument = await this.mediaModel.findById(mediaId).exec()
        if (!mediaDocument) { throw new MediaNotFoundException() }
        return plainToInstance(MediaResponseDto, mediaDocument, { excludeExtraneousValues: true })
    }

    async getMediaStream(mediaId: string): Promise<GridFSBucketReadStream> {
        const mediaDocument = await this.mediaModel.findById(mediaId).exec()
        if (!mediaDocument) { throw new MediaNotFoundException() }
        const mediaObjectId = ObjectId.createFromHexString(mediaDocument.id)
        const mediaFileDocument = await this.bucket.find(mediaObjectId).next()
        if  (!mediaFileDocument) { throw new MediaHasNoStreamException() }
        return this.bucket.openDownloadStream(mediaObjectId)
    }

    async deleteMedia(mediaId: string, session?: any): Promise<MediaResponseDto> {
        const mediaDocument = await this.mediaModel.findByIdAndDelete(mediaId, {session}).exec()
        if (!mediaDocument) { throw new MediaNotFoundException() }
        if (mediaDocument.type === "file") {
            const mediaObjectId = ObjectId.createFromHexString(mediaDocument.id)
            await this.bucket.delete(mediaObjectId)
        }
        this.eventEmitter.emit("media.deleted", mediaDocument.id)
        return plainToInstance(MediaResponseDto, mediaDocument, { excludeExtraneousValues: true })
    }
}