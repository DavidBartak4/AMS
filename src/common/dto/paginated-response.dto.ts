import { ApiProperty } from "@nestjs/swagger"
import { Expose } from "class-transformer"

export class PaginatedResponseDto<T> {
    @ApiProperty({ type: "array" })
    @Expose()
    docs: T[]

    @ApiProperty()
    @Expose()
    totalDocs: number

    @ApiProperty()
    @Expose()
    limit: number

    @ApiProperty()
    @Expose()
    totalPages: number

    @ApiProperty()
    @Expose()
    page: number

    @ApiProperty()
    @Expose()
    pagingCounter: number

    @ApiProperty()
    @Expose()
    hasPrevPage: boolean

    @ApiProperty()
    @Expose()
    hasNextPage: boolean

    @ApiProperty({ nullable: true })
    @Expose()
    prevPage?: number

    @ApiProperty({ nullable: true })
    @Expose()
    nextPage?: number
}