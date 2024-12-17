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
import { FilterQuery, PaginateResult } from "mongoose"
import { GetBookingsBodyDto, GetBookingsQueryDto } from "./dto/get.bookings.dto"
import { UpdateBookingBodyDto } from "./dto/update.booking.dto"
import * as fs from "fs"
import * as path from "path"
import { GetRoomsByAvailbilityBodyDto, GetRoomsByAvailbilityQueryDto } from "./dto/get.rooms.by.availbility.dto"

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name)
    private readonly bookingModel: BookingModel,
    private readonly configurationService: ConfigurationService,
    private readonly roomsService: RoomsService,
  ) {}

  async createBooking(body: CreateBookingBodyDto, confirmation?: boolean) {
    const room = await this.roomsService.getRoom(body.roomId)
    if (!room) {
      throw new BadRequestException("Room not found")
    }
    const bookingConflict = await this.isBookingConflict(
      body.roomId,
      body.checkIn,
      body.checkOut,
    )
    if (bookingConflict) {
      throw new BadRequestException("Booking range is occupied")
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
    if (confirmation === true || (confirmation === undefined && body.email)) {
      if (!body.email) {
        throw new BadRequestException("Cannot create booking without email")
      }
      try {
        await this.sendBookingConfirmation(
          booking,
          room.name,
          room.number.toString(),
        )
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
    roomNumber?: string,
  ): Promise<void> {
    const configuration = await this.configurationService.getConfiguration()
    const mailConfiguration = configuration.mail
    if (!mailConfiguration.mailUsername || !mailConfiguration.mailPassword) {
      throw new Error(
        "Cannot send confirmation because host mail auth is not configured",
      )
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
    const htmlTemplatePath = path.join(
      process.cwd(),
      "src",
      "bookings",
      "public",
      "html",
      "email.html",
    )
    const textTemplatePath = path.join(
      process.cwd(),
      "src",
      "bookings",
      "public",
      "txt",
      "email.txt",
    )
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
    return uuidv4().toUpperCase()
  }

  async getBooking(bookingId: string): Promise<Booking> {
    const booking = await this.bookingModel.findById(bookingId).exec()
    if (!booking) {
      throw new BadRequestException("Booking not found")
    }
    return booking
  }

  async getBookings(
    query: GetBookingsQueryDto,
    body: GetBookingsBodyDto,
  ): Promise<PaginateResult<Booking>> {
    const filter: FilterQuery<Booking> = {}
    if (body.roomId) {
      filter.roomId = body.roomId
    }
    if (body.email) {
      filter.email = body.email
    }
    if (body.bookingCode) {
      filter.bookingCode = body.bookingCode
    }
    if (body.checkIn) {
      filter.checkIn = { $gte: new Date(body.checkIn) }
    }
    if (body.checkOut) {
      filter.checkOut = { $lte: new Date(body.checkOut) }
    }
    if (body.bookingDateRange) {
      filter.checkIn = { $gte: new Date(body.bookingDateRange.min) }
      filter.checkOut = { $lte: new Date(body.bookingDateRange.max) }
    }
    if (body.bookingDurationInDays?.duration !== undefined) {
      const { operator, duration } = body.bookingDurationInDays
      const durationInMs = duration * 24 * 60 * 60 * 1000
      const operatorMap = {
        ">": "$gt",
        "<": "$lt",
        ">=": "$gte",
        "<=": "$lte",
      }
      const mongoOperator = operator ? operatorMap[operator] : "$eq"
      if (mongoOperator) {
        filter.$expr = {
          [mongoOperator]: [
            { $subtract: ["$checkOut", "$checkIn"] },
            durationInMs,
          ],
        }
      } else {
        throw new Error(`Invalid operator: ${operator}`)
      }
    }
    return await this.bookingModel.paginate(filter, {
      limit: query.limit,
      page: query.page,
      sort: { checkIn: 1 },
    })
  }

  async updateBooking(
    bookingId: string,
    body: UpdateBookingBodyDto,
  ): Promise<Booking> {
    const booking = await this.bookingModel.findById(bookingId).exec()
    if (!booking) {
      throw new BadRequestException("Booking not found")
    }
    const room = await this.roomsService.getRoom(body.roomId || booking.roomId)
    if (body.roomId) booking.roomId = body.roomId
    if (body.email) booking.email = body.email
    if (body.checkIn) booking.checkIn = body.checkIn
    if (body.checkOut) booking.checkOut = body.checkOut
    if (body.phone) booking.phone = body.phone
    if (body.owner) {
      booking.owner = {
        ...booking.owner,
        ...body.owner,
      }
    }
    if (
      body.confirmation === true ||
      (body.confirmation === undefined && body.email)
    ) {
      if (!body.email) {
        throw new BadRequestException("Cannot create booking without email")
      }
      try {
        await this.sendBookingConfirmation(
          booking,
          room.name,
          room.number.toString(),
        )
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
    return await booking.save()
  }

  async deleteBooking(bookingId: string): Promise<void> {
    const booking = await this.bookingModel.findByIdAndDelete(bookingId).exec()
    if (!booking) {
      throw new BadRequestException("Booking not found")
    }
    return
  }

  async getBookingConflict(roomId: string, checkIn: Date, checkOut: Date): Promise<void> {
    if (await this.isBookingConflict(roomId, checkIn, checkOut)) {
      throw new BadRequestException("Booking range is occupied")
    }
  }
  
  async getRoomsByAvailbility(query: GetRoomsByAvailbilityQueryDto, body: GetRoomsByAvailbilityBodyDto) {
    const { checkIn, checkOut } = body
  const { limit = 10, page = 1 } = query
  const conflictedRooms = await this.bookingModel.distinct('roomId', {
    $or: [
      {
        checkIn: { $lt: new Date(checkOut) },
        checkOut: { $gt: new Date(checkIn) },
      },
    ],
  })
  const filter = {
    _id: { $nin: conflictedRooms },
  }
  const options = {
    limit,
    page,
  }
  const result = await this.roomsService.roomModel.paginate(filter, options)
  return {
    total: result.totalDocs,
    limit: result.limit,
    page: result.page,
    totalPages: result.totalPages,
    rooms: result.docs,
  }
  }

  async isBookingConflict(
    roomId: string,
    checkIn: Date,
    checkOut: Date,
  ): Promise<Boolean> {
    await this.roomsService.getRoom(roomId)
    const conflict = await this.bookingModel.exists({
      roomId: roomId,
      $or: [
        {
          checkIn: { $lt: checkOut },
          checkOut: { $gt: checkIn },
        },
      ],
    })
    return conflict !== null
  }
}