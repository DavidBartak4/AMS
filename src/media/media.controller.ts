import { Controller, Get, Param, Res } from "@nestjs/common"
import { MediaService } from "./media.service"
import { ApiOperation, ApiTags } from "@nestjs/swagger"
import { MediaParamsDto } from "./dto/media-params.dto"
import { ApiResponse } from "src/common/decorators/api-response.decorator"
import { MediaErrorMessages } from "./media.exceptions"

@Controller("media")
@ApiTags("Media")
export class MediaController {
    constructor(private readonly mediaService: MediaService) {}

    @Get(":mediaId/stream")
    @ApiOperation({ summary: "Gets stream of a media by ID"})
    @ApiResponse({ status: 404, description: [MediaErrorMessages.MEDIA_NOT_FOUND, MediaErrorMessages.MEDIA_HAS_NO_STREAM] })
    @ApiResponse({ status: 200, description: "Binary File (.bin)" })
    async getMediaStream(@Param() mediaParamsDto: MediaParamsDto, @Res() res) {
        const stream = await this.mediaService.getMediaStream(mediaParamsDto.mediaId)
        stream.pipe(res)
    }
}