import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common"
import { GridFSBucket, GridFSBucketReadStream, ObjectId } from "mongodb"
import { InjectConnection } from "@nestjs/mongoose"
import { Connection } from "mongoose"
import { File } from "multer"
import { Media, MediaDocument } from "./schemas/media.schema"
import { Model } from "mongoose"
import { InjectModel } from "@nestjs/mongoose"
import { CreateMediaBodyDto } from "./dto/create.media.dto"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class MediaService {
  private bucket: GridFSBucket

  constructor(@InjectConnection() private readonly connection: Connection, @InjectModel(Media.name) private readonly mediaModel: Model<MediaDocument>, private readonly configService: ConfigService) {
    this.bucket = new GridFSBucket(this.connection.db, {
      bucketName: "media",
    })
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
    const media = await this.mediaModel.findById(mediaId).exec()
    if (!media) { throw new NotFoundException("Media not found") }
    if (media.type !== "file") { throw new BadRequestException("Media type is not a file") }
    const objectId = new ObjectId(mediaId)
    const file = await this.bucket.find({ _id: objectId }).next()
    if (!file) { throw new NotFoundException("Media file not found") }
    return this.bucket.openDownloadStream(objectId)
  }

  async getMediaInfo(mediaId: string): Promise<Media> {
    const media = await this.mediaModel.findById(mediaId).exec()
    if (!media) { throw new NotFoundException("Media not found") }
    if (media.type === "file") {
      media.location = this.getMediaStreamLocation(media._id.toString())
    }
    return media
  }

  async deleteMedia(mediaId: string): Promise<void> {
    const objectId = new ObjectId(mediaId)
    const media = await this.mediaModel.findByIdAndDelete(mediaId).exec()
    if (!media) { throw new NotFoundException("Media not found") }
    if (media.type === "file") { await this.bucket.delete(objectId) }
  }

  async getMediaArray(mediaIds: string[]): Promise<Media[]> {
    const objectIds = mediaIds.map(function (id) {
      try { return new ObjectId(id) } 
      catch (error) { throw new BadRequestException(`Invalid media ID: ${id}`) }
    })
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
    const url = this.configService.get("url")
    if (!url) { throw new BadRequestException("Stream location is not active") }
    return `${url}/media/${mediaId}/stream`
  }
}