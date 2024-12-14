import { IsMongoId, IsString } from "class-validator"

export class DeleteBookingParamsDto {
    @IsString()
    @IsMongoId()
    bookingId: string
}