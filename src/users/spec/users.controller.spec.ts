import { Test, TestingModule } from "@nestjs/testing"
import { Types } from "mongoose"
import { UsersService } from "../users.service"
import { CreateUserDto } from "../dto/create-user.dto"
import { UsersController } from "../users.controller"

const usersServiceMock = {
    createUser: jest.fn(),
    getUser: jest.fn(),
    getUsers: jest.fn(),
    deleteUser: jest.fn()
}

describe("UsersService", function() {
    let controller: UsersController
    let service: jest.Mocked<UsersService>

    beforeEach(async function() {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                UsersService,
                {
                    provide: UsersService,
                    useValue: usersServiceMock
                }
            ]
        }).compile()
        controller = module.get(UsersController)
        service = module.get(UsersService)
    })

    describe("create", function() {
        it("should create a new user", async function() {
            const mockedUser = {
                id: (new Types.ObjectId()).toString(),
                username: "john_doe",
                role: "admin"
            }
            const createUserDto: CreateUserDto = {
                username: "john_doe",
                password: "12345678",
                role: "admin"
            }
            service.createUser.mockResolvedValueOnce(mockedUser)
            const result = await controller.createUser(createUserDto)
            expect(result).toEqual(mockedUser)
            expect(service.createUser).toHaveBeenCalledWith(createUserDto)
        })
    })
})