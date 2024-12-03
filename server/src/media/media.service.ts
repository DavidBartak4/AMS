import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common"
import { MongoClient, GridFSBucket, ObjectId } from "mongodb"
import { File } from "multer"

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

  async uploadMediaInstance(file: File) {
    const self = this
    return new Promise(function (resolve, reject) {
      const uploadStream = self.bucket.openUploadStream(file.originalname, {
        contentType: file.mimetype,
      })
      uploadStream.end(file.buffer)
      uploadStream.on("finish", function () {
        try {
          resolve({
            _id: uploadStream.id,
            filename: file.originalname,
            contentType: file.mimetype,
          })
        } catch (error) {
          reject(error)
        }
      })
      uploadStream.on("error", function (error) {
        reject(error)
      })
    })
  }

  async getMediaFile(id: string) {
    const objectId = new ObjectId(id)
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

  async doesMediaExist(id: string) {
    try {
      const objectId = new ObjectId(id)
      const file = await this.bucket.find({ _id: objectId }).toArray()
      return file.length > 0
    } catch (error) {
      return false
    }
  }

  async getMedia() {
    try {
      const files = await this.bucket.find().toArray()
      return files.map((file) => ({
        _id: file._id,
        filename: file.filename,
        contentType: file.contentType,
        uploadDate: file.uploadDate,
        length: file.length,
      }))
    } catch (error) {
      throw new BadRequestException("Could not list media files")
    }
  }

  async deleteMediaInstance(id: string) {
    try {
      const objectId = new ObjectId(id)
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
}