import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common"
import { GridFSBucket, GridFSBucketReadStream, ObjectId } from "mongodb"
import { InjectConnection } from "@nestjs/mongoose"
import { Connection } from "mongoose"
import { File } from "multer"
import { Media, MediaDocument } from "./schemas/media.schema"
import { Model } from "mongoose"
import { InjectModel } from "@nestjs/mongoose"

@Injectable()
export class MediaService {
  private bucket: GridFSBucket

  constructor(@InjectConnection() private readonly connection: Connection, @InjectModel(Media.name) private readonly mediaModel: Model<MediaDocument>) {
    this.bucket = new GridFSBucket(this.connection.db, {
      bucketName: "media",
    })
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
        resolve(media)
      })
      uploadStream.on("error", (err) => { reject(new BadRequestException("Failed to upload file")) })
    })
  }

  async createMediaByUrl(url: string): Promise<Media> {
    const media = new this.mediaModel({ type: "url", url })
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
    return media
  }

  async deleteMedia(mediaId: string): Promise<void> {
    const objectId = new ObjectId(mediaId)
    const media = await this.mediaModel.findByIdAndDelete(mediaId).exec()
    if (!media) { throw new NotFoundException("Media not found") }
    if (media.type === "file") { await this.bucket.delete(objectId) }
  }
}