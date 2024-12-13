import { IsOptional, IsIn, IsString, IsBoolean, Min } from "class-validator"
import { Type } from "class-transformer"

export class GetAdminsQueryDto {
  @IsOptional()
  @Type(function() { return Number })
  @IsIn([10, 25, 50, 100])
  limit?: number = 10

  @IsOptional()
  @Type(function() { return Number })
  @Min(1)
  page?: number
}

export class GetAdminsBodyDto {
  @IsOptional()
  @IsBoolean()
  partial?: boolean = false

  @IsOptional()
  @IsString()
  username?: string
}