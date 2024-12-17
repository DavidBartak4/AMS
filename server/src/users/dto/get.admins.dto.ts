import { IsOptional, IsIn, IsString, IsBoolean, Min, IsInt } from "class-validator"
import { Type } from "class-transformer"

export class GetAdminsQueryDto {
  @IsOptional()
  @Type(function() { return Number })
  @IsIn([10, 25, 50, 100])
  limit?: number = 10

  @IsOptional()
  @Type(function() { return Number })
  @IsInt()
  @Min(1)
  page?: number = 1
}

export class GetAdminsBodyDto {
  @IsOptional()
  @IsBoolean()
  partial?: boolean = false

  @IsOptional()
  @IsString()
  username?: string
}