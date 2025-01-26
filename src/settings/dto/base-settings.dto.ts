import { ApiProperty } from "@nestjs/swagger"
import { Expose, Type } from "class-transformer"
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator"
import { StrictOptional } from "src/common/decorators/strict-optional"
import { SettingsDefaults } from "../settings.config"
import { NullToUndefined } from "src/common/decorators/null-to-undefined.decorator"

class MailAuth {
    @ApiProperty({ nullable: true })
    @Expose()
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    username: string | null

    @ApiProperty({ nullable: true })
    @Expose()
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    password: string | null
}

class Mail {
    @ApiProperty({ nullable: true, default: SettingsDefaults.PORT })
    @Expose()
    @IsOptional()
    @IsNumber()
    port: number | null

    @ApiProperty({ example: "gmail.com", nullable: true })
    @Expose()
    @IsOptional()
    @IsString()
    provider: string | null
 
    @ApiProperty({ type: MailAuth })
    @Expose()
    @IsOptional()
    @ValidateNested()
    @Type(function() { return MailAuth })
    @NullToUndefined()
    auth: MailAuth

    @ApiProperty()
    @Expose()
    @StrictOptional()
    @IsBoolean()
    useName: boolean
}

export class BaseSettingsDto {
    @ApiProperty({ nullable: true })
    @Expose()
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name: string | null

    @ApiProperty({ type: Mail })
    @Expose()
    @IsOptional()
    @ValidateNested()
    @Type(function() { return Mail })
    @NullToUndefined()
    mail: Mail
}