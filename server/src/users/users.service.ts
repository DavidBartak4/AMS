import { NotFoundException, Injectable, BadRequestException, ConflictException, UnauthorizedException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { User, UserModel } from "./schemas/user.schema"
import { CreateUserBodyDto } from "./dto/create.user.dto"
import { GetAdminsBodyDto, GetAdminsQueryDto } from "./dto/get.admins.dto"
import { UpdateUserBodyDto } from "./dto/update.user.dto"
import { PaginateResult } from "mongoose"
import * as bcrypt from "bcryptjs"

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: UserModel) {}

  async createUser(body :CreateUserBodyDto): Promise<User> { 
    body.password = await this.hashPassword(body.password)
    try {
      return await this.userModel.create(body)
    } catch (err) {
      if (err.code === 11000) {
        throw new ConflictException("Username is already taken")
      }
    }
  }

  async getAdmins(body: GetAdminsBodyDto, query: GetAdminsQueryDto, select?: string): Promise<PaginateResult<User>> {
    select = select || "-password"
    const filter: any = { roles: { $in: ["admin", "super-admin"] } }
    if (body.username) { filter.username = body.partial ? { $regex: body.username, $options: "i" } : body.username }
    const adminsPage = await this.userModel.paginate(filter, { page: query.page, limit: query.limit, select: select })
    if (adminsPage.totalPages > query.page) { throw new NotFoundException("Page not found") }
    return adminsPage
  }

  async getUser(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId).exec()
    if (!user) { throw new NotFoundException("User not found") }
    return user
  }

  async findUser(properties: Object): Promise<User> {
    const user = await this.userModel.findOne(properties).exec()
    if (!user) { throw new NotFoundException("User not found") }
    return user
  }

  async updateUser(userId: string, dto: UpdateUserBodyDto): Promise<User> {
    if (dto.password) { dto.password = await this.hashPassword(dto.password) }
    await this.getUser(userId)
    return await this.userModel.findByIdAndUpdate(userId, dto).exec()
  }

  async deleteUser(userId: string) {
    await this.getUser(userId)
    await this.userModel.findByIdAndDelete(userId).exec()
    return
  }

  async addRoleToUser(userId: string, role: string): Promise<User> {
    const user = await this.getUser(userId)
    if (user.roles.includes(role)) { throw new BadRequestException("User already has this role") }
    user.roles.push(role)
    await this.userModel.findByIdAndUpdate(userId, user).exec()
    return
  }

  async removeRoleFromUser(userId: string, role: string): Promise<User> {
    const user = await this.getUser(userId)
    if (!user.roles.includes(role)) { throw new BadRequestException("User does not have  role") }
    user.roles = user.roles.filter(function(userRole) { return userRole !== role })
    await this.userModel.findByIdAndUpdate(userId, user).exec()
    return
  }

  async getUserRoles(userId: string): Promise<string[]> {
    const user = await this.getUser(userId)
    return user.roles
  }

  async validateCredentials(username: string, password: string): Promise<User> {
    const user = await this.findUser({ username: username})
    const isValidCredentials = await bcrypt.compare(password, user.password)
    if (!isValidCredentials) { throw new UnauthorizedException("Invalid credentials") }
    return user
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10)
  }
}