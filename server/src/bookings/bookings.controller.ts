import { Body, Controller, Post, Req, UseGuards, Param, ValidationPipe, Get, Query, Patch, Delete } from "@nestjs/common"
import { BookingService } from "./bookings.service"
import { CreateBookingBodyDto } from "./dto/create.booking.dto"
import { Roles } from "src/auth/decorators/roles.decorator"
import { OptionalAuthGuard } from "src/auth/guards/auth.guard"
import { JwtAuthGuard } from "src/auth/guards/jwt.guard"
import { RolesGuard } from "src/auth/guards/roles.guard"
import { GetBookingParamsDto } from "./dto/get.booking.dto"
import { GetBookingsBodyDto, GetBookingsQueryDto } from "./dto/get.bookings.dto"
import { UpdateBookingBodyDto, UpdateBookingParamsDto } from "./dto/update.booking.dto"
import { DeleteBookingParamsDto } from "./dto/delete.booking.dto"
import { GetBookingConflictBodyDto } from "./dto/get.booking.conflict.dto"
import { GetRoomsByAvailbilityBodyDto, GetRoomsByAvailbilityQueryDto } from "./dto/get.rooms.by.availbility.dto"

@Controller("bookings")
export class BookingsController {
  constructor(private readonly bookingsService: BookingService) {}

  @Post()
  @Roles("admin", "super-admin")
  @UseGuards(OptionalAuthGuard)
  async createBooking(@Body() body: CreateBookingBodyDto, @Req() req) {
    if (req.user && (req.user.roles.includes("admin") || req.user.roles.includes("super-admin"))) {
      return await this.bookingsService.createBooking(body, body.confirmation)
    } else {
      return await this.bookingsService.createBooking(body, true)
    }
  }

  @Get(":bookingId")
  @Roles("admin", "super-admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getBooking(@Param(new ValidationPipe()) params: GetBookingParamsDto) {
    return await this.bookingsService.getBooking(params.bookingId)
  }

  @Get()
  @Roles("admin", "super-admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getBookings(@Query() query: GetBookingsQueryDto, @Body() body: GetBookingsBodyDto) {
    return await this.bookingsService.getBookings(query, body)
  }

  @Patch(":bookingId")
  @Roles("admin", "super-admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateBooking(@Param(new ValidationPipe()) params: UpdateBookingParamsDto, @Body() body: UpdateBookingBodyDto) {
    return await this.bookingsService.updateBooking(params.bookingId, body)
  }

  @Delete(":bookingId")
  @Roles("admin", "super-admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteBooking(@Param(new ValidationPipe()) params: DeleteBookingParamsDto) {
    return await this.bookingsService.deleteBooking(params.bookingId)
  }

  @Post("conflict")
  @Roles("admin", "super-admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getBookingConflict(@Body() body: GetBookingConflictBodyDto) {
    return await this.bookingsService.getBookingConflict(body.roomId, body.checkIn, body.checkOut)
  }

  @Post("availability")
  async getRoomsByAvailbility(@Query() query: GetRoomsByAvailbilityQueryDto ,@Body() body: GetRoomsByAvailbilityBodyDto) {
    return await this.bookingsService.getRoomsByAvailbility(query, body)
  }
}