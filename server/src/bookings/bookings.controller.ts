import {
  Controller,
  UseGuards,
  Body,
  Post,
  Get,
  Patch,
  Delete,
  ValidationPipe,
  Param,
} from "@nestjs/common"
import { JwtAuthGuard } from "../auth/guards/jwt.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"
import { PostBookingBodyDto } from "./dto/post.booking.dto"
import { BookingService } from "./bookings.service"
import { BookingParamsDto } from "./dto/booking.dto"
import { PatchBookingBodyDto } from "./dto/patch.booking.dto"
import { GetBookingConflictBodyDto } from "./dto/get.bookingConflict.dto"
import { RoomParamsDto } from "src/rooms/dto/room.dto"

@Controller("bookings")
export class BookingsController {
  constructor(private readonly bookingsService: BookingService) {}

  /*
  @Post()
  async createBooking(@Body() body: PostBookingBodyDto) {
    return await this.bookingsService.createBooking(body)
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("super-admin", "admin")
  async getBookings() {
    return await this.bookingsService.getBookings()
  }

  @Get(":bookingId")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("super-admin", "admin")
  async getBooking(@Param(new ValidationPipe()) params: BookingParamsDto) {
    return await this.bookingsService.getBooking(params.bookingId)
  }

  @Patch(":bookingId")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("super-admin", "admin")
  async patchBooking(
    @Param(new ValidationPipe()) params: BookingParamsDto,
    @Body() body: PatchBookingBodyDto,
  ) {
    return await this.bookingsService.patchBooking(params.bookingId, body)
  }

  @Get("rooms/:roomId/conflict")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("super-admin", "admin")
  async checkBookingConflict(@Param(new ValidationPipe()) params: RoomParamsDto, @Body() body: GetBookingConflictBodyDto) {
    console.log(body)
    return await this.bookingsService.checkBookingConflict(params.roomId, body.checkIn, body.checkOut)
  }

  @Get("rooms/:roomId")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("super-admin", "admin")
  async getBookingsByRoom(@Param(new ValidationPipe()) params: RoomParamsDto) {
    return await this.bookingsService.getBookingsByRoom(params.roomId)
  }

  @Delete(":bookingId")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("super-admin", "admin")
  async deleteBooking(@Param(new ValidationPipe()) params: BookingParamsDto) {
    return await this.bookingsService.deleteBooking(params.bookingId)
  }
  */
}