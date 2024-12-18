import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common"
import { GridFSBucket, GridFSBucketReadStream, ObjectId } from "mongodb"
import { InjectConnection } from "@nestjs/mongoose"
import { Connection } from "mongoose"
import { File } from "multer"
import { Media, MediaDocument } from "./schemas/media.schema"
import { Model } from "mongoose"
import { InjectModel } from "@nestjs/mongoose"
import { CreateMediaBodyDto } from "./dto/create.media.dto"
import { ConfigService as AppConfigService } from "@nestjs/config"
import { FailedToUploadException, MediaNotFoundException, MediaStreamLocationNotActiveException, MediaStreamNotFoundException, UnspecifiedMediaUploadException } from "./media.exceptions"

@Injectable()
export class MediaService {
  private bucket: GridFSBucket

  constructor(@InjectConnection() private readonly connection: Connection, @InjectModel(Media.name) private readonly mediaModel: Model<MediaDocument>, private readonly appConfigService: AppConfigService) {
    this.bucket = new GridFSBucket(this.connection.db, { bucketName: "media" })
  }

  async createMedia(body: CreateMediaBodyDto & { file?: File }): Promise<Media> {
    if (body.type === "url") {
      if (!body.location) { throw new UnspecifiedMediaUploadException }
      return await this.createMediaByUrl(body.location)
    }
    if (body.type === "file") {
      if (!body.file) { throw new UnspecifiedMediaUploadException }
      return await this.createMediaByFile(body.file)
    }
  }

  async createMediaByFile(file: File): Promise<Media> {
    if (!this.appConfigService.get("url")) { throw new MediaStreamLocationNotActiveException}
    return new Promise((resolve, reject) => {
      const uploadStream = this.bucket.openUploadStream(file.originalname, { contentType: file.mimetype })
      uploadStream.end(file.buffer)
      uploadStream.on("finish", async () => {
        const media = new this.mediaModel({
          _id: uploadStream.id,
          type: "file",
          filename: file.originalname,
          contentType: file.mimetype,
        })
        await media.save()
        media.location = await this.getMediaStreamLocation(media._id.toString())
        resolve(media)
      })
      uploadStream.on("error", (err) => {reject(new FailedToUploadException)})
    })
  }

  async createMediaByUrl(location: string): Promise<Media> {
    return await this.mediaModel.create({ type: "url", location: location })
  }

  async getMediaStream(mediaId: string): Promise<GridFSBucketReadStream> {
    const media = await this.mediaModel.findById(mediaId)
    if (!media) { throw new MediaNotFoundException}
    const mediaObjectId = new ObjectId(mediaId)
    const stream = await this.bucket.find(mediaObjectId).next()
    if (!stream) { throw new MediaStreamNotFoundException }
    return this.bucket.openDownloadStream(mediaObjectId)
  }

  async getMedia(mediaId: string): Promise<Media> {
    if (!this.appConfigService.get("url")) { throw new MediaStreamLocationNotActiveException}
    const media = await this.mediaModel.findById(mediaId).exec()
    if (!media) { throw new MediaNotFoundException }
    if (media.type === "file") { media.location = this.getMediaStreamLocation(media._id.toString()) }
    return media
  }

  async deleteMedia(mediaId: string): Promise<void> {
    const media = await this.mediaModel.findByIdAndDelete(mediaId).exec()
    if (!media) { throw new MediaNotFoundException }
    const mediaObjectId = new ObjectId(mediaId)
    if (media.type === "file") { await this.bucket.delete(mediaObjectId) }
  }

  getMediaStreamLocation(mediaId: string): string {
    const url = this.appConfigService.get("url")
    if (!url) { throw new MediaStreamLocationNotActiveException }
    return `${url}/media/${mediaId}/stream`
  }
}