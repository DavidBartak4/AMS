import { ApiProperty } from "@nestjs/swagger"
import { IsMongoId } from "class-validator"

export class UserParamsDto {
    @ApiProperty({ description: "ID of a user"})
    @IsMongoId()
    userId: string
}