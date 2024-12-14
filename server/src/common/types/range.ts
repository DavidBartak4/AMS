import { IsNumber } from "class-validator"

export class Range {
  @IsNumber()
  min: number

  @IsNumber()
  max: number
}