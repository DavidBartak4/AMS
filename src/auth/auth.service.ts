import { Injectable } from "@nestjs/common"
import { LoginDto } from "./dto/login.dto"
import { UpdateCredentialsDto } from "./dto/update-credentials.dto"
import { UsersService } from "src/users/users.service"
import { UserResponseDto } from "src/users/dto/user-response.dto"
import { LoginResponseDto } from "./dto/login-response.dto"
import { JwtService } from "@nestjs/jwt"

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

    async login(loginDto: LoginDto): Promise<LoginResponseDto> {
        const userResponseDto = await this.usersService.authenticate(loginDto.username, loginDto.password)
        return {
            user: userResponseDto,
            access_token: await this.createToken(userResponseDto)
        }
    }

    async updateCredentials(userId: string, updateCredentialsDto: UpdateCredentialsDto): Promise<UserResponseDto> {
        return await this.usersService.updateUserById(userId, updateCredentialsDto)
    }

    private async createToken(userResponseDto: UserResponseDto): Promise<string> {
        return this.jwtService.sign({
            sub: userResponseDto.id,
            username: userResponseDto.username,
            role: userResponseDto.role
        })
    }
}