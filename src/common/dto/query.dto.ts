import { IsOptional, IsIn, Min, IsInt, IsBoolean } from "class-validator"
import { ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer"

export class QueryDto {
  @ApiPropertyOptional({ description: "Limit number for pagination" })
  @IsOptional()
  @Type(function () { return Number })
  @IsIn([10, 25, 50, 100])
  limit: number = 10

  @ApiPropertyOptional({ description: "Page number for pagination" })
  @IsOptional()
  @Type(function () { return Number })
  @IsInt()
  @Min(1)
  page: number = 1
}