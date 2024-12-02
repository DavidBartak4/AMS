import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { MediaController } from "./media.controller"
import { MediaService } from "./media.service"
import { Media, MediaSchema } from "./schemas/media.schema"

@Module({
  imports: [],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService]
})
export class MediaModule {}