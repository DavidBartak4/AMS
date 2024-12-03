import { IsString, IsMongoId } from "class-validator"

export class BookingParamsDto {
  @IsString()
  @IsMongoId()
  bookingId: string
}