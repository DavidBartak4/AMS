import { Prop } from "@nestjs/mongoose"
import { IsMongoId, IsString } from "class-validator"

export class UpdateRoomParamsDto {
    @Prop()
    @IsString()
    @IsMongoId()
    roomId: string
}

export class UpdateRoomBodyDto {
    
}