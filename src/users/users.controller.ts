import { UsersService } from "./users.service"
import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from "@nestjs/common"
import { CreateUserDto } from "./dto/create-user.dto"
import { UserParamsDto } from "./dto/user-params.dto"
import { UsersQueryDto } from "./dto/users-query.dto"
import { ApiOperation, ApiTags } from "@nestjs/swagger"
import { UserResponseDto } from "./dto/user-response.dto"
import { PaginatedUsersResponseDto } from "./dto/paginated-users-response.dto"
import { ApiResponse } from "src/common/decorators/api-response.decorator"
import { ApiErrorMessages } from "src/common/api.exceptions"
import { UsersErrorMessages } from "./users.exceptions"
import { AuthErrorMessages } from "src/auth/auth.exceptions"
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard"
import { RolesGuard } from "src/auth/guards/roles.guard"
import { Roles } from "src/auth/decorators/roles.decorator"

@Controller("users")
@ApiTags("Users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    @ApiOperation({ summary: "Creates a user"})
    @ApiResponse({ status: 401, description: [ApiErrorMessages.UNAUTHORIZED, AuthErrorMessages.JWT_EXPIRED]})
    @ApiResponse({ status: 403, description: ApiErrorMessages.FORBIDDEN })
    @ApiResponse({ status: 400, description: UsersErrorMessages.CREATE_USER })
    @ApiResponse({ status: 409, description: UsersErrorMessages.USERNAME_IN_USE })
    @ApiResponse({ status: 201, type: UserResponseDto })
    @Roles("super-admin")
    @UseGuards(JwtAuthGuard, RolesGuard)
    async createUser(@Body() createUserDto: CreateUserDto) {
        return await this.usersService.createUser(createUserDto)
    }

    @Get(":userId")
    @ApiOperation({ summary: "Gets a user by ID"})
    @ApiResponse({ status: 401, description: [ApiErrorMessages.UNAUTHORIZED, AuthErrorMessages.JWT_EXPIRED]})
    @ApiResponse({ status: 404, description: [...UsersErrorMessages.USER_PARAMS, UsersErrorMessages.USER_NOT_FOUND]})
    @ApiResponse({ status: 200, type: UserResponseDto })
    @UseGuards(JwtAuthGuard)
    async getUser(@Param() userParamsDto: UserParamsDto) {
        return await this.usersService.getUser({ id: userParamsDto.userId })
    }

    @Get()
    @ApiOperation({ summary: "Get paginated list of users"})
    @ApiResponse({ status: 401, description: [ApiErrorMessages.UNAUTHORIZED, AuthErrorMessages.JWT_EXPIRED]})
    @ApiResponse({ status: 400, description: UsersErrorMessages.USERS_QUERY })
    @ApiResponse({ status: 200, type: PaginatedUsersResponseDto })
    @UseGuards(JwtAuthGuard)
    async getUsers(@Query() usersQueryDto: UsersQueryDto) {
        return await this.usersService.getPaginatedUsers(usersQueryDto)
    }

    @Delete(":userId")
    @ApiOperation({ summary: "Deletes a user by ID"})
    @ApiResponse({ status: 401, description: [ApiErrorMessages.UNAUTHORIZED, AuthErrorMessages.JWT_EXPIRED]})
    @ApiResponse({ status: 403, description: ApiErrorMessages.FORBIDDEN })
    @ApiResponse({ status: 400, description: UsersErrorMessages.USER_PARAMS })
    @ApiResponse({ status: 404, description: UsersErrorMessages.USER_NOT_FOUND })
    @ApiResponse({ status: 200, type: UserResponseDto })
    @Roles("super-admin")
    @UseGuards(JwtAuthGuard, RolesGuard)
    async deleteUser(@Param() userParamsDto: UserParamsDto) {
        return await this.usersService.deleteUserById(userParamsDto.userId)
    }
}