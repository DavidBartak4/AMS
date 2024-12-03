import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { AuthModule } from "./auth/auth.module"
import { UsersModule } from "./users/users.module"
import { AppService } from "./app.service"
import { MediaModule } from "./media/media.module"
import { AttributesModule } from "./attributes/attributes.module"
import { RoomsModule } from "./rooms/rooms.module"
import { BookingModule } from "./bookings/bookings.module"
import { ConfigurationModule } from "./configuration/configuration.module"

@Module({
  imports: [
    MongooseModule.forRoot("mongodb://localhost/AMS"),
    AuthModule,
    UsersModule,
    MediaModule,
    AttributesModule,
    RoomsModule,
    BookingModule,
    ConfigurationModule,
  ],
  providers: [AppService],
})
export class AppModule {}
