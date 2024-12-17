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

@Injectable()
export class MediaService {
  private bucket: GridFSBucket

  constructor(@InjectConnection() private readonly connection: Connection, @InjectModel(Media.name) private readonly mediaModel: Model<MediaDocument>, private readonly appConfigService: AppConfigService) {
    this.bucket = new GridFSBucket(this.connection.db, { bucketName: "media" })
  }

  async createMedia(body: CreateMediaBodyDto & { file?: File }): Promise<Media> {
    if (body.type === "url") { return await this.createMediaByUrl(body.location) }
    if (body.type === "file") {
      if (!body.file) { throw new BadRequestException("No file was provided for upload") }
      return await this.createMediaByFile(body.file)
    }
  }

  async createMediaByFile(file: File): Promise<Media> {
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
      uploadStream.on("error", (err) => { reject(new BadRequestException("Failed to upload file")) })
    })
  }

  async createMediaByUrl(location: string): Promise<Media> {
    const media = new this.mediaModel({ type: "url", location: location })
    await media.save()
    return media
  }

  async getMediaStream(mediaId: string): Promise<GridFSBucketReadStream> {
    const mediaInfo = await this.getMediaInfo(mediaId)
    if (mediaInfo.type !== "file") { throw new BadRequestException("Media must be type of file") }
    const objectId = new ObjectId(mediaId)
    const file = await this.bucket.find(objectId).next()
    if (!file) { throw new NotFoundException("Media file not found") }
    return this.bucket.openDownloadStream(objectId)
  }

  async getMediaInfo(mediaId: string): Promise<Media> {
    const media = await this.mediaModel.findById(mediaId).exec()
    if (!media) { throw new NotFoundException("Media not found") }
    if (media.type === "file") { media.location = this.getMediaStreamLocation(media._id.toString()) }
    return media
  }

  async deleteMedia(mediaId: string): Promise<void> {
    const media = await this.mediaModel.findByIdAndDelete({ _id: mediaId }).exec()
    if (!media) { throw new NotFoundException("Media not found") }
    const objectId = new ObjectId(mediaId)
    if (media.type === "file") { await this.bucket.delete(objectId) }
  }

  async getMediaInfoArray(mediaIds: string[]): Promise<Media[]> {
    const objectIds = mediaIds.map(function (mediaId) { return new ObjectId(mediaId) })
    const mediaArray = await this.mediaModel.find({ _id: { $in: objectIds } }).exec()
    const foundIds = mediaArray.map(function (media) { return media._id.toString() })
    const missingIds = mediaIds.filter(function (id) { return !foundIds.includes(id) })
    if (missingIds.length > 0) { throw new NotFoundException(`Media not found for IDs: ${missingIds.join(", ")}`) } 
    return mediaArray.map(function (media) {
      if (media.type === "file") { media.location = this.getMediaStreamLocation(media._id.toString()) }
      return media
    })
  }

  private getMediaStreamLocation(mediaId: string): string {
    const url = this.appConfigService.get("url")
    if (!url) { throw new BadRequestException(`Stream location is not active for media ${mediaId}`) }
    return `${url}/media/${mediaId}/stream`
  }
}