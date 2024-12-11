import { IsOptional, IsIn, IsString, IsBoolean } from "class-validator"
import { Type } from "class-transformer"

export class GetAdminsQueryDto {
  @IsOptional()
  @Type(function() { return Number })
  @IsIn([10, 25, 50, 100])
  limit?: number = 10

  @IsOptional()
  @Type(function() { return Number })
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