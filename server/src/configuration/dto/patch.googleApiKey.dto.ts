import { IsOptional, IsString, IsNotEmpty } from "class-validator"

export class PatchGoogleApiKeyBodyDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  googleApiKey?: string
}