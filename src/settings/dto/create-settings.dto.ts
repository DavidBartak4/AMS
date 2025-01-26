import { PartialType } from "@nestjs/swagger"
import { BaseSettingsDto } from "./base-settings.dto"

export class CreateSettingsDto extends PartialType(BaseSettingsDto) {}