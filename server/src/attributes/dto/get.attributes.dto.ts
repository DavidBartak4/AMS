import { IsBoolean, IsOptional, IsString } from "class-validator"
import { PaginatedQueryDto } from "src/common/dto/paginated.query.dto"

export class GetAttributesQueryDto extends PaginatedQueryDto {}

export class GetAttributesBodyDto {
  @IsOptional()
  @IsBoolean()
  partial?: boolean = false

  @IsOptional()
  @IsString()
  name?: string
}