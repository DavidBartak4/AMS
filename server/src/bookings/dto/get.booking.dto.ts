import { IsMongoId, IsString } from "class-validator"

export class GetBookingParamsDto {
    @IsString()
    @IsMongoId()
    bookingId: string
}