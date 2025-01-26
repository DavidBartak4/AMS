import { Body, Controller, Get, HttpCode, Post, UseGuards } from "@nestjs/common"
import { SettingsService } from "./settings.service"
import { UpdateSettingsDto } from "./dto/update-settings.dto"
import { ApiOperation, ApiTags } from "@nestjs/swagger"
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard"
import { ApiResponse } from "src/common/decorators/api-response.decorator"
import { SettingsResponseDto } from "./dto/settings-response.dto"
import { ApiErrorMessages } from "src/common/api.exceptions"
import { AuthErrorMessages } from "src/auth/auth.exceptions"
import { SettingsErrorMessages } from "./settings.exceptions"

@Controller("settings")
@ApiTags("Settings")
@UseGuards(JwtAuthGuard)
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) {}

    @Get()
    @ApiOperation({ summary: "Gets app settings" })
    @ApiResponse({ status: 401, description: [ApiErrorMessages.UNAUTHORIZED, AuthErrorMessages.JWT_EXPIRED]})
    @ApiResponse({ status: 200, type: SettingsResponseDto })
    async getSettings() {
        return await this.settingsService.getSettings()
    }

    @Post()
    @HttpCode(200)
    @ApiOperation({ summary: "Updates app settings", description: "Mail will be verified if all properties are defined in database" })
    @ApiResponse({ status: 401, description: [ApiErrorMessages.UNAUTHORIZED, AuthErrorMessages.JWT_EXPIRED]})
    @ApiResponse({ status: 400, description: [...SettingsErrorMessages.UPDATE_SETTINGS, SettingsErrorMessages.MAIL_DNS, SettingsErrorMessages.MAIL_EAUTH] })
    @ApiResponse({ status: 504, description: [SettingsErrorMessages.MAIL_ECONNECTION, SettingsErrorMessages.MAIL_ETIMEDOUT] })
    @ApiResponse({ status: 200, type: SettingsResponseDto })
    async updateSettings(@Body() updateSettingsDto: UpdateSettingsDto) {
        return await this.settingsService.updateSettings(updateSettingsDto)
    }
}