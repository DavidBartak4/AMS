import { File } from "multer"
import { BadRequestException } from "@nestjs/common"

export function filterFileTypes(allowedMimeTypes: string[], errMessage?: string) {
    return function(req: any, file: File, callback: Function) {
        if (!allowedMimeTypes.includes(file.mimetype)) { 
            return callback(new BadRequestException(errMessage || "Unsupported file type")) 
        }
        callback(null, true)
    }
}