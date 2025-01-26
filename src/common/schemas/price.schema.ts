import { Prop, Schema } from "@nestjs/mongoose"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Expose, Type } from "class-transformer"
import { IsISO4217CurrencyCode, IsNumber, IsOptional, IsString, IsUppercase, Min } from "class-validator"

@Schema({ _id: false })
export class Price {
    @Prop({ default: 0 })
    @ApiProperty()
    @Expose()
    @Type(function() { return Number })
    @IsNumber()
    @Min(0)
    value: number

    @Prop({ required: true })
    @ApiProperty({ description: "Uperrcased ISO4217 Currency Code", example: "USD" })
    @Expose()
    @IsString()
    @IsUppercase()
    @IsISO4217CurrencyCode()
    currency: string
}

export class PriceQueryDto {
    @ApiPropertyOptional()
    @IsOptional()
    @Type(function() { return Number })
    @IsNumber()
    minPrice: number

    @ApiPropertyOptional()
    @IsOptional()
    @Type(function() { return Number })
    @IsNumber()
    maxPrice: number

    @ApiPropertyOptional()
    @Expose()
    @Type(function() { return Number })
    @IsNumber()
    @Min(0)
    priceValue: number
    
    @ApiPropertyOptional({ description: "Uperrcased ISO4217 Currency Code", example: "USD" })
    @Expose()
    @IsString()
    @IsUppercase()
    @IsISO4217CurrencyCode()
    priceCurrency: string
}