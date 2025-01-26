import { PickType } from "@nestjs/swagger"
import { CreateMediaDto } from "./create-media.dto"

export class CreateMediaBodyDto extends PickType(CreateMediaDto, ["url", "file"]) {}