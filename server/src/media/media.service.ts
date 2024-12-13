import { Injectable, Inject, BadRequestException, NotFoundException } from "@nestjs/common"
import { GridFSBucket, GridFSBucketReadStream, ObjectId } from "mongodb"
import { Media } from "./schemas/media.schema"
import { CreateMediaByUrlBodyDto } from "./dto/create.media.dto"
import { getConnectionToken } from "@nestjs/mongoose"
import { Connection } from "mongoose"
import { File } from "multer"

@Injectable()
export class MediaService {
  private bucket: GridFSBucket

  constructor(@Inject(getConnectionToken()) private readonly connection: Connection) {
    const db = this.connection.db
    this.bucket = new GridFSBucket(db, { bucketName: "media" })
  }

  async createMediaByFile(file: File) {
    if (!file || !file.originalname || !file.mimetype || !file.buffer) { throw new BadRequestException("Invalid file data") }
    return new Promise<Media>(function (resolve, reject) {
      const uploadStream = this.bucket.openUploadStream(file.originalname, { contentType: file.mimetype })
      uploadStream.end(file.buffer)
      uploadStream.on("finish", function () {
        const media: Media = {
          _id: uploadStream.id,
          type: "file",
          filename: file.originalname,
          contentType: file.mimetype,
        }
        resolve(media)
      }.bind(this)) 
      uploadStream.on("error", function (error) {
        reject(new BadRequestException(`File upload failed: ${error.message}`))
      }.bind(this)) 
    }.bind(this))
  }

  async createMediaByUrl(body: CreateMediaByUrlBodyDto): Promise<Media> {
    const mediaCollection = this.connection.db.collection<Media>("media")
    const media: Media = { _id: new ObjectId(), type: "url", url: body.url }
    await mediaCollection.insertOne(media)
    return media
  }
  
  async getMediaStream(mediaId: string): Promise<GridFSBucketReadStream> {
    const objectId = new ObjectId(mediaId)
    const mediaCollection = this.connection.db.collection<Media>("media")
    const media = await mediaCollection.findOne({ _id: objectId })
    if (!media || media.type !== "file" || !media.filename) { throw new NotFoundException("File-based media not found") }
    try { return this.bucket.openDownloadStream(objectId) } 
    catch (error) { throw new BadRequestException(`Error retrieving file: ${error.message}`) }
  }

  async getMediaInfo(mediaId: string): Promise<Media> {
    const objectId = new ObjectId(mediaId)
    const mediaCollection = this.connection.db.collection<Media>("media")
    const media = await mediaCollection.findOne({ _id: objectId })
    if (!media) { throw new NotFoundException("Media not found") }
    return media
  }

  async deleteMedia(mediaId: string): Promise<void> {
    const objectId = new ObjectId(mediaId)
    const mediaCollection = this.connection.db.collection<Media>("media")
    const media = await mediaCollection.findOne({ _id: objectId })
    if (!media) { throw new NotFoundException("Media not found") }
    try {
      if (media.type === "file" && media.filename) { await this.bucket.delete(objectId) }
      await mediaCollection.deleteOne({ _id: objectId })
    } catch (error) { throw new BadRequestException(`Error deleting media: ${error.message}`) }
  }
}