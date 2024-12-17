import { Type } from "class-transformer"
import { IsString, IsOptional, IsNumber, IsMongoId, Min, IsIn, IsInt, IsBoolean } from "class-validator"

export class GetRoomTypesQueryDto {
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

export class GetRoomTypesBodyDto {
  @IsOptional()
  @IsBoolean()
  partial?: boolean = false

  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsNumber()
  capacity?: number

  @IsOptional()
  @IsString({ each: true })
  @IsMongoId({ each: true })
  attributeIds?: string[]
}
