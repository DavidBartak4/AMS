import { IsOptional, IsIn, Min, IsInt } from "class-validator"
import { Type } from "class-transformer"

export class GetAttributesQueryDto {
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