import { IsOptional, IsString, IsBoolean } from "class-validator"
import { PaginatedQueryDto } from "src/common/dto/paginated.query.dto"

export class GetAdminsQueryDto extends PaginatedQueryDto {}

export class GetAdminsBodyDto {
  @IsOptional()
  @IsBoolean()
  partial?: boolean = false

  @IsOptional()
  @IsString()
  username?: string
}