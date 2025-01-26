
import { getModelToken } from "@nestjs/mongoose"
import { Test, TestingModule } from "@nestjs/testing"
import { PaginateModel, Types } from "mongoose"
import { UsersService } from "../users.service"
import { CreateUserDto } from "../dto/create-user.dto"
import { User } from "../schemas/user.schema"

const userModelMock = {
    create: jest.fn(),
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    paginate: jest.fn()
}

describe("UsersService", function() {
    let service: UsersService
    let model: jest.Mocked<PaginateModel<User>>

    beforeEach(async function() {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getModelToken(User.name),
                    useValue: userModelMock
                }
            ]
        }).compile()
        service = module.get(UsersService)
        model = module.get(getModelToken(User.name))
    })

    describe("create", function() {
        it("should create a new user", async function() {
            const mockedUser = {
                username: "john_doe",
                role: "admin"
            }

            const createUserDto = {
                username: "john_doe",
                password: "12345678",
                role: "admin"
            }

            model.create.mockResolvedValueOnce(mockedUser as any)
            const result = await service.createUser(createUserDto)
            expect(result).toEqual(mockedUser)
            expect(model.create).toHaveBeenCalledWith(createUserDto)
        })
    })
})