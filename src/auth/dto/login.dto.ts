import { PickType } from "@nestjs/swagger"
import { BaseUserDto } from "src/users/dto/base-user.dto"

export class LoginDto extends PickType(BaseUserDto, ["username", "password"]) {}