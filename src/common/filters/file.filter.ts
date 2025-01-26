import { File } from "multer"
import { BadRequestException } from "@nestjs/common"
import { ApiErrorMessages } from "../api.exceptions"

export function filterFileTypes(allowedMimeTypes: string[], errMessage?: string) {
    return function(req: any, file: File, callback: Function) {
        if (!allowedMimeTypes.includes(file.mimetype)) { 
            return callback(new BadRequestException(errMessage || ApiErrorMessages.UNSUPPORTED_FILE_TYPE)) 
        }
        callback(null, true)
    }
}