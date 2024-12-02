import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { AuthModule } from "./auth/auth.module"
import { UsersModule } from "./users/users.module"
import { AppService } from "./app.service"
import { MediaModule } from "./media/media.module"
import { AttributesModule } from "./attributes/attributes.module"

@Module({
  imports: [
    MongooseModule.forRoot("mongodb://localhost/AMS"),
    AuthModule,
    UsersModule,
    MediaModule,
    AttributesModule
  ],
  providers: [AppService],
})
export class AppModule {}