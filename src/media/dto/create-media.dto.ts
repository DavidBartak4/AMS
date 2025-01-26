import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString, IsUrl, ValidateIf } from "class-validator"

export class CreateMediaDto {
    @ApiProperty()
    @ValidateIf(function(obj) {return obj.url === null && obj.url === undefined})
    file?: File

    @ApiProperty()
    @ValidateIf(function(obj) {return obj.file === null && obj.file === undefined})
    @IsString()
    @IsNotEmpty()
    @IsUrl()
    url?: string
}