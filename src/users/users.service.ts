import { Injectable } from "@nestjs/common"
import { User, UserModel } from "./schemas/user.schema"
import { CreateUserDto } from "./dto/create-user.dto"
import { UsersQueryDto } from "./dto/users-query.dto"
import { UpdateUserDto } from "./dto/update-user.dto"
import { InjectModel } from "@nestjs/mongoose"
import { UserResponseDto } from "./dto/user-response.dto"
import { PaginatedUsersResponseDto } from "./dto/paginated-users-response.dto"
import { HandleDuplicateKeyMongooseError } from "src/common/decorators/handle-duplicate-key-mongoose-error.decorator"
import { plainToInstance } from "class-transformer"
import * as bcrypt from "bcryptjs"
import { InvalidCredentialsException, UserNotFoundException, UsersErrorMessages } from "./users.exceptions"

@Injectable()
@HandleDuplicateKeyMongooseError("username", UsersErrorMessages.USERNAME_IN_USE)
export class UsersService {
    constructor(@InjectModel(User.name) private readonly userModel: UserModel) {}

    async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
        const userDocument = await this.userModel.create(createUserDto)
        return plainToInstance(UserResponseDto, userDocument, { excludeExtraneousValues: true })
    }

    async getUser(filter): Promise<UserResponseDto> {
        const userDocument = await this.userModel.findOne(filter).exec()
        if (!userDocument) {
            throw new UserNotFoundException()
        }
        return plainToInstance(UserResponseDto, userDocument, { excludeExtraneousValues: true })
    }

    async getPaginatedUsers(usersQueryDto: UsersQueryDto): Promise<PaginatedUsersResponseDto> {
        const { page, limit, ...filters } = usersQueryDto
        const query: any = {}
        if (filters.username) {
            const escapedUsername = filters.username.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            query.$or = [
                { username: filters.username },
                { username: { $regex: escapedUsername, $options: "i" } }
            ]
        }
        if (filters.role) {
            query.role = filters.role
        }
        const paginatedUsers = await this.userModel.paginate(query, { page, limit })
        return plainToInstance(PaginatedUsersResponseDto, paginatedUsers, { excludeExtraneousValues: true })
    }

    async updateUserById(userId: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
        const userDocument = await this.userModel.findOneAndUpdate({ id: userId }, updateUserDto, { new: true }).exec()
        if (!userDocument) {
            throw new UserNotFoundException()
        }
        return plainToInstance(UserResponseDto, userDocument, { excludeExtraneousValues: true })
    }

    async deleteUserById(userId: string): Promise<UserResponseDto> {
        const userDocument = await this.userModel.findByIdAndDelete(userId).exec()
        if (!userDocument) {
            throw new UserNotFoundException()
        }
        return plainToInstance(UserResponseDto, userDocument, { excludeExtraneousValues: true })
    }

    async authenticate(username: string, password: string): Promise<UserResponseDto> {
        const userDocument = await this.userModel.findOne({ username: username }).exec()
        if (!userDocument) {
            throw new UserNotFoundException()
        }
        const isValidPassword = await bcrypt.compare(password, userDocument.password)
        if (!isValidPassword) {
            throw new InvalidCredentialsException()
        }
        return plainToInstance(UserResponseDto, userDocument, { excludeExtraneousValues: true })
    }

    async getUserExists(filter): Promise<boolean> {
        const userObjectId = await this.userModel.exists(filter).exec()
        if (userObjectId) {
            return true
        } else {
            return false
        }
    }
}