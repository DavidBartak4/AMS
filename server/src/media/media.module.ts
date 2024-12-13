import { Module } from "@nestjs/common"
import { MediaService } from "./media.service"
import { MediaController } from "./media.controller"
import { Media, MediaSchema } from "./schemas/media.schema"
import { MongooseModule } from "@nestjs/mongoose"

@Module({
  imports: [MongooseModule.forFeature([{ name: Media.name, schema: MediaSchema }])],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}