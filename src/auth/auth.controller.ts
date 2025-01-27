import { Body, Controller, HttpCode, Post, Req, UseGuards } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { LoginDto } from "./dto/login.dto"
import { UpdateCredentialsDto } from "./dto/update-credentials.dto"
import { ApiResponse } from "src/common/decorators/api-response.decorator"
import { UsersErrorMessages } from "src/users/users.exceptions"
import { LoginResponseDto } from "./dto/login-response.dto"
import { AuthErrorMessages } from "./auth.exceptions"
import { ApiErrorMessages } from "src/common/api.exceptions"
import { UserResponseDto } from "src/users/dto/user-response.dto"
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"
import { JwtAuthGuard } from "./guards/jwt-auth.guard"

@Controller("auth")
@ApiTags("Auth")
@ApiBearerAuth()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("login")
    @HttpCode(200)
    @ApiOperation({ summary: "Logins-in a user" })
    @ApiResponse({ status: 400, description: AuthErrorMessages.LOGIN })
    @ApiResponse({ status: 401, description: UsersErrorMessages.INVALID_CREDENTIALS })
    @ApiResponse({ status: 404, description: UsersErrorMessages.USER_NOT_FOUND })
    @ApiResponse({ status: 200, type: LoginResponseDto })
    async login(@Body() loginDto: LoginDto) {
        return await this.authService.login(loginDto)
    }

    @Post("credentials")
    @HttpCode(200)
    @ApiOperation({ summary: "Updates user's credentials" })
    @ApiResponse({ status: 401, description: [AuthErrorMessages.JWT_EXPIRED, ApiErrorMessages.UNAUTHORIZED] })
    @ApiResponse({ status: 400, description: AuthErrorMessages.UPDATE_CREDENTIALS })
    @ApiResponse({ status: 404, description: UsersErrorMessages.USER_NOT_FOUND })
    @ApiResponse({ status: 409, description: UsersErrorMessages.USERNAME_IN_USE })
    @ApiResponse({ status: 200, type: UserResponseDto })
    @UseGuards(JwtAuthGuard)
    async updateCredentials(@Req() req, @Body() updateCredentialsDto: UpdateCredentialsDto) {
        return await this.authService.updateCredentials(req.user.id, updateCredentialsDto)
    }
}