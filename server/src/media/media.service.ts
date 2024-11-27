import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import { MongoClient, GridFSBucket, ObjectId } from "mongodb"
import { Response } from "express"

@Injectable()
export class MediaService {
  private client: MongoClient
  private bucket: GridFSBucket

  constructor() {
    const self = this
    this.client = new MongoClient("mongodb://localhost/AMS")
    this.client.connect().then(function () {
      const db = self.client.db("AMS")
      self.bucket = new GridFSBucket(db, { bucketName: "uploads" })
    })
  }

  async uploadMediaInstance(file: Express.MulterFile) {
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

  async getMediaFile(id: string, res: Response) {
    try {
      const downloadStream = this.bucket.openDownloadStream(new ObjectId(id))
      downloadStream.pipe(res).on("error", function () {
        throw new NotFoundException("File not found")
      })
    } catch (error) {
      if (error instanceof Error && error.message.includes("Argument passed")) {
        throw new NotFoundException("Invalid file ID")
      }
      throw new NotFoundException("File not found")
    }
  }
  async getMedia() {
    try {
      const files = await this.bucket.find().toArray();
      return files.map((file) => ({
        _id: file._id,
        filename: file.filename,
        contentType: file.contentType,
        uploadDate: file.uploadDate,
        length: file.length,
      }));
    } catch (error) {
      throw new BadRequestException("Could not list media files");
    }
  }
  
  async deleteMediaInstance(id: string) {
    try {
      const objectId = new ObjectId(id)
      await this.bucket.delete(objectId)
      return { message: "File deleted successfully", id }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("File not found for id")) {
          throw new NotFoundException(`File not found for ID: ${id}`)
        }
        if (error.message.includes("Argument passed")) {
          throw new BadRequestException(`Invalid file ID: ${id}`)
        }
      }
      throw error
    }
  }
}