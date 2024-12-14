import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { ConfigurationService } from "src/configuration/configuration.service"
import { RoomsService } from "src/rooms/rooms.service"
import { Booking, BookingModel } from "./schemas/booking.schema"
import * as nodeMailer from "nodemailer"
import { CreateBookingBodyDto } from "./dto/create.booking.dto"
import { v4 as uuidv4 } from "uuid"
import { PaginateResult } from "mongoose"
import { GetBookingsBodyDto, GetBookingsQueryDto } from "./dto/get.bookings.dto"
import { UpdateBookingBodyDto } from "./dto/update.booking.dto"
import * as fs from "fs"
import * as path from "path"

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name)
    private readonly bookingModel: BookingModel,
    private readonly configurationService: ConfigurationService,
    private readonly roomsService: RoomsService,
  ) {}

  async createBooking(
    body: CreateBookingBodyDto,
    sendBookingConfirmation?: boolean
  ) {
    const room = await this.roomsService.getRoom(body.roomId)
    if (!room) {
      throw new BadRequestException("Room not found")
    }
    const bookingCode = this.generateBookingCode()
    const booking = new this.bookingModel({
      bookingCode,
      owner: body.owner,
      roomId: body.roomId,
      email: body.email,
      checkIn: body.checkIn,
      checkOut: body.checkOut,
      phone: body.phone,
    })
    if (sendBookingConfirmation === true || (sendBookingConfirmation === undefined && body.email)) {
      if (!body.email) {
        throw new BadRequestException("Cannot create booking without email")
      }
      try {
        await this.sendBookingConfirmation(booking, room.name, room.number.toString())
      } catch (err) {
        if (
          err.message ===
          "Cannot send confirmation because host mail auth is not configured"
        ) {
          throw new InternalServerErrorException(
            "Booking cannot be created, please contact web administrator",
          )
        } else {
          throw new InternalServerErrorException(err)
        }
      }
    }
    try {
      return await booking.save()
    } catch (err) {
      throw new InternalServerErrorException("Failed to create booking")
    }
  }

  private async sendBookingConfirmation(
    booking,
    roomName: string,
    roomNumber?: string
  ): Promise<void> {
    const configuration = await this.configurationService.getConfiguration()
    const mailConfiguration = configuration.mail
    if (!mailConfiguration.mailUsername || !mailConfiguration.mailPassword) {
      throw new Error("Cannot send confirmation because host mail auth is not configured")
    }
    const { mailHost, mailPort, mailUsername, mailPassword } = mailConfiguration
    const transporter = nodeMailer.createTransport({
      host: mailHost,
      port: mailPort || 587,
      secure: mailPort === 465,
      auth: {
        user: mailUsername,
        pass: mailPassword,
      },
    })
    const htmlTemplatePath = path.join(process.cwd(), "src", "bookings", "public", "html", "email.html")
    const textTemplatePath = path.join(process.cwd(), "src", "bookings", "public", "txt", "email.txt")
    let htmlContent = fs.readFileSync(htmlTemplatePath, "utf8")
    let textContent = fs.readFileSync(textTemplatePath, "utf8")
    const replacements = {
      "{{firstname}}": booking.owner.firstname,
      "{{lastname}}": booking.owner.lastname,
      "{{bookingCode}}": booking.bookingCode,
      "{{checkIn}}": booking.checkIn,
      "{{checkOut}}": booking.checkOut,
      "{{roomName}}": roomName,
      "{{roomNumber}}": roomNumber || "N/A",
      "{{year}}": new Date().getFullYear().toString(),
    }
    for (const [key, value] of Object.entries(replacements)) {
      htmlContent = htmlContent.replace(new RegExp(key, "g"), value)
      textContent = textContent.replace(new RegExp(key, "g"), value)
    }
    const mailOptions = {
      from: `"Booking Confirmation" <${mailUsername}>`,
      to: booking.email,
      subject: `Your Booking Confirmation - Code: ${booking.bookingCode}`,
      text: textContent,
      html: htmlContent,
    }
    try {
      await transporter.sendMail(mailOptions)
    } catch (error) {
      throw new Error("Failed to send booking confirmation email")
    }
  }

  private generateBookingCode(): string {
    return `${uuidv4().slice(0, 8).toUpperCase()}`
  }

  async getBooking(bookingId: string): Promise<Booking> {
    return
  }

  async getBookings(
    query: GetBookingsQueryDto,
    body: GetBookingsBodyDto,
  ): Promise<PaginateResult<Booking>> {
    return
  }

  async updateBooking(
    bookingId: string,
    body: UpdateBookingBodyDto,
  ): Promise<Booking> {
    return
  }

  async deleteBooking(bookingId: string): Promise<void> {
    return
  }

  async getBookingConflict(
    roomId: string,
    checkIn: Date,
    checkOut: Date,
  ): Promise<Boolean> {
    return
  }
}
