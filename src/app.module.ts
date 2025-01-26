import { Module } from "@nestjs/common"
import { AppService } from "./app.service"
import { UsersModule } from "./users/users.module"
import { MongooseModule } from "@nestjs/mongoose"
import { EventEmitterModule } from "@nestjs/event-emitter"
import { ConfigModule } from "@nestjs/config"
import mongoose from "mongoose"
import { addIdVirtual } from "./common/plguins/add-id-virtual-mongoose.plugin"
import { enableIdQuery } from "./common/plguins/enable-id-query-mongose.plugin"
import { AuthModule } from "./auth/auth.module"
import { SettingsModule } from "./settings/settings.module"
import { MediaModule } from "./media/media.module"
import { AttributesModule } from "./attributes/attributes.module"
import { RoomsModule } from "./rooms/room.module"

@Module({
  imports: [
    MongooseModule.forRoot("mongodb://localhost/AMS"),
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    UsersModule,
    AuthModule,
    SettingsModule,
    MediaModule,
    AttributesModule,
    RoomsModule
  ],
  providers: [AppService]
})

export class AppModule {
  constructor() {
    mongoose.plugin(addIdVirtual)
    mongoose.plugin(enableIdQuery)
  }
}