import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { BookingDocument, Booking } from "./schemas/booking.schema"
import { PostBookingBodyDto } from "./dto/post.booking.dto"
import { PatchRoomBodyDto } from "src/rooms/dto/patch.room.dto"
import { v4 as uuidv4 } from "uuid"
import { ConfigurationService } from "src/configuration/configuration.service"

@Injectable()
export class BookingService {
  constructor(@InjectModel(Booking.name) private readonly bookingModel: Model<BookingDocument>, private readonly configurationService: ConfigurationService) {}

  async createBooking(dto: PostBookingBodyDto) {
    const bookingCode = this.generateBookingCode()
    const booking = await this.bookingModel.create({ ...dto, bookingCode })
    await this.sendBookingConfirmation(booking)
    return booking
  }

  private generateBookingCode(): string {
    return `BOOK-${uuidv4().slice(0, 8).toUpperCase()}`
  }

  private async sendBookingConfirmation(booking: BookingDocument) {
    /*
    const config = await this.configurationService.getConfiguration()
    if (!config.mailHost || !config.mailUsername || !config.mailPassword) {
      throw new Error("Mail configuration is not set up")
    }
    await this.mailerService.sendMail({
      to: booking.email,
      subject: "Booking Confirmation",
      text: `Dear customer,\n\nYour booking has been successfully created. Booking Code: ${booking.bookingCode}`,
    })
    */
  }

  async getBookings() {
    return await this.bookingModel.find().exec()
  }

  async getBooking(bookingId: string) {
    const booking = await this.bookingModel.findById(bookingId).exec()
    if (!booking) throw new NotFoundException("Booking not found")
    return booking
  }

  async patchBooking(bookingId: string, dto: PatchRoomBodyDto) {
    const booking = await this.bookingModel.findByIdAndUpdate(bookingId, dto, { new: true }).exec()
    if (!booking) throw new NotFoundException("Booking not found")
    return booking
  }

  async deleteBooking(bookingId: string) {
    const result = await this.bookingModel.findByIdAndDelete(bookingId).exec()
    if (!result) throw new NotFoundException("Booking not found")
    return { message: "Booking successfully deleted" }
  }
}