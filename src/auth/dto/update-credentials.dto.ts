import { PartialType, PickType } from "@nestjs/swagger"
import { BaseUserDto } from "src/users/dto/base-user.dto"

export class UpdateCredentialsDto extends PartialType(PickType(BaseUserDto, ["username", "password"])) {}