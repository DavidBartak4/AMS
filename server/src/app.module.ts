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
import { EventEmitterModule } from "@nestjs/event-emitter"
import { AppController } from "./app.controller"
import { ConfigModule as AppConfigModule } from "@nestjs/config"

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    MongooseModule.forRoot("mongodb://localhost/AMS"),
    AppConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    MediaModule,
    AttributesModule,
    RoomsModule,
    BookingModule,
    ConfigurationModule
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}