import { PartialType } from "@nestjs/swagger"
import { BaseSettingsDto } from "./base-settings.dto"

export class UpdateSettingsDto extends PartialType(BaseSettingsDto) {}