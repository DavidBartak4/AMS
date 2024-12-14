import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { ConfigurationService } from "src/configuration/configuration.service"
import { RoomsService } from "src/rooms/rooms.service"
import { Booking, BookingDocument } from "./schemas/booking.schema"

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name)
    private readonly bookingModel: Model<BookingDocument>,
    private readonly configurationService: ConfigurationService,
    private readonly roomsService: RoomsService,
  ) {}
}

  /*
  async createBooking(dto: PostBookingBodyDto) {
    await this.roomsService.getRoom(dto.roomId)
    const bookingCode = this.generateBookingCode()
    const booking = await this.bookingModel.create({ ...dto, bookingCode })
    try {
      await this.sendBookingConfirmation(booking)
      return booking
    } catch (error) {
      await this.deleteBooking(booking._id.toString())
      throw new BadRequestException(
        "Failed to send confirmation email, booking failed",
      )
    }
  }

  private generateBookingCode(): string {
    return `${uuidv4().slice(0, 8).toUpperCase()}`
  }

  private async sendBookingConfirmation(booking: BookingDocument) {
    const configuration = await this.configurationService.getConfiguration()
    const { mailHost, mailPort, mailUsername, mailPassword } = configuration
    const transporter = nodeMailer.createTransport({
      host: mailHost,
      port: mailPort || 587,
      secure: mailPort === 465,
      auth: {
        user: mailUsername,
        pass: mailPassword,
      },
    })
    const mailOptions = {
      from: `"Booking Confirmation" <${mailUsername}>`,
      to: booking.email,
      subject: "Your Booking Confirmation",
      text: `Hello ${booking.owner.firstname},\n\nYour booking has been confirmed.\n\nBooking Code: ${booking.bookingCode}\nCheck-in: ${booking.checkIn}\nCheck-out: ${booking.checkOut}\n\nThank you for choosing our service.`,
      html: `<p>Hello ${booking.owner.firstname},</p><p>Your booking has been confirmed.</p><p><strong>Booking Code:</strong> ${booking.bookingCode}</p><p><strong>Check-in:</strong> ${booking.checkIn}</p><p><strong>Check-out:</strong> ${booking.checkOut}</p><p>Thank you for choosing our service.</p>`,
    }
    try {
      await transporter.sendMail(mailOptions)
    } catch (error) {
      throw new Error("Failed to send booking confirmation email")
    }
  }

  async getBookings() {
    return await this.bookingModel.find().exec()
  }

  async getBooking(bookingId: string) {
    const booking = await this.bookingModel.findById(bookingId).exec()
    if (!booking) throw new NotFoundException("Booking not found")
    return booking
  }

  async getBookingsByRoom(roomId: string) {
    await this.roomsService.getRoom(roomId)
    const bookings = await this.bookingModel.find({ roomId }).exec()
    return bookings
  }

  async checkBookingConflict(roomId: string, checkIn: Date, checkOut: Date) {
    await this.roomsService.getRoom(roomId)
    if (checkIn >= checkOut) {
      throw new BadRequestException("Check-in date must be before check-out date")
    }
    const conflictingBookings = await this.bookingModel
      .find({
        roomId,
        $or: [
          { checkIn: { $lt: checkOut }, checkOut: { $gt: checkIn } },
        ],
      })
      .exec()
    if (conflictingBookings.length > 0) {
      throw new BadRequestException("Conflicting bookings exist for the provided date range")
    }
    return { message: "No conflicts found, the room is available for booking" }
  }

  async patchBooking(bookingId: string, dto: PatchBookingBodyDto) {
    if (dto.roomId) {
      await this.roomsService.getRoom(dto.roomId)
    }
    const booking = await this.bookingModel
      .findByIdAndUpdate(bookingId, dto, { new: true })
      .exec()
    if (!booking) throw new NotFoundException("Booking not found")
    return booking
  }

  async deleteBooking(bookingId: string) {
    const result = await this.bookingModel.findByIdAndDelete(bookingId).exec()
    if (!result) throw new NotFoundException("Booking not found")
    return { message: "Booking successfully deleted" }
  }
  */