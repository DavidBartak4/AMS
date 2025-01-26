import { ApiProperty } from "@nestjs/swagger";
import { UserResponseDto } from "src/users/dto/user-response.dto";

export class LoginResponseDto {
    @ApiProperty({ type: UserResponseDto })
    user: UserResponseDto
    
    @ApiProperty({ description: "Bearer authentication token" })
    access_token: string
}