import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import { MongoClient, GridFSBucket, ObjectId } from "mongodb"
import { File } from "multer"
import { Media } from "./schemas/media.schema"

@Injectable()
export class MediaService {
  private client: MongoClient
  private bucket: GridFSBucket

  constructor() {
    const self = this
    this.client = new MongoClient("mongodb://localhost/AMS")
    this.client.connect().then(function () {
      const db = self.client.db("AMS")
      self.bucket = new GridFSBucket(db, { bucketName: "media" })
    })
  }
  /*

  async createMedia(file :File) {
    const self = this
    return new Promise(function (resolve, reject) {
      const uploadStream = self.bucket.openUploadStream(file.originalname, { contentType: file.mimetype })
      uploadStream.end(file.buffer)
      uploadStream.on("finish", function () {
        const media: Media = {
          _id: new ObjectId(uploadStream.id),
          filename: file.originalname,
          contentType: file.mimetype
        }
        resolve(media)
      })
      uploadStream.on("error", function (error) {
        reject(error)
      })
    })
  }

  getMediaStreamUrl(imageId) {
    return `http://localhost:3000/media/${imageId}`
  }

  async getMediaStream(mediaId: string) {
    const objectId = new ObjectId(mediaId)
    const file = await this.bucket.find({ _id: objectId }).toArray()
    if (file.length === 0) {
      throw new NotFoundException("File not found")
    }
    try {
      const downloadStream = this.bucket.openDownloadStream(objectId)
      return downloadStream
    } catch (error) {
      throw new BadRequestException("Error retrieving file")
    }
  }

  async deleteMedia(mediaId: string) {
    try {
      const objectId = new ObjectId(mediaId)
      await this.bucket.delete(objectId)
      return
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("File not found for id")) {
          throw new NotFoundException("File not found")
        }
      }
      throw error
    }
  }
  */
}