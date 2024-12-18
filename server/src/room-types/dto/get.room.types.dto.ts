import { Transform, Type } from "class-transformer"
import { IsString, IsOptional, IsNumber, IsMongoId, IsBoolean, ValidateNested, Min } from "class-validator"
import { IsRange } from "src/common/decorators/range.decorator"
import { PaginatedQueryDto } from "src/common/dto/paginated.query.dto"

export class GetRoomTypesQueryDto extends PaginatedQueryDto {}

export class CapacityRange {
  @IsNumber()
  @Min(0)
  min: number

  @IsNumber()
  max: number
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
  @ValidateNested()
  @Type(function() { return CapacityRange })
  @IsRange()
  ["capacity.range"]: CapacityRange

  @IsOptional()
  @IsString({ each: true })
  @IsMongoId({ each: true })
  attributeIds?: string[]

  @IsOptional()
  @Transform(function (field) {
    const value = field.value
    return Array.isArray(value) ? value : [value]
  })
  @IsString({ each: true })
  @IsMongoId({ each: true })
  attributeId?: string[]
}
