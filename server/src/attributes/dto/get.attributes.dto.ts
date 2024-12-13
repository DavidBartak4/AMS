import { IsOptional, IsIn, Min } from "class-validator"
import { Type } from "class-transformer"

export class GetAttributesQueryDto {
  @IsOptional()
  @Type(function() { return Number })
  @IsIn([10, 25, 50, 100])
  limit?: number = 10

  @IsOptional()
  @Type(function() { return Number })
  @Min(1)
  page?: number
}