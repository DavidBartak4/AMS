import { NotFoundException, Injectable, BadRequestException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { User, UserModel } from "./schemas/user.schema"
import { CreateUserBodyDto } from "./dto/create.user.dto"
import { GetAdminsBodyDto, GetAdminsQueryDto } from "./dto/get.admins.dto"
import { UpdateUserBodyDto } from "./dto/update.user.dto"
import { PaginateResult } from "mongoose"

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: UserModel) {}

  async createUser(body :CreateUserBodyDto): Promise<User> {
    return await this.userModel.create(body)
  }

  async getAdmins(body: GetAdminsBodyDto,query: GetAdminsQueryDto, select?: string): Promise<PaginateResult<User>> {
    select = select || ""
    const filter: any = { roles: { $in: ["admin", "super-admin"] } }
    if (body.username) {
      filter.username = body.partial ? { $regex: body.username, $options: "i" } : body.username
    }
    const adminsPage = await this.userModel.paginate(filter, { page: query.page, limit: query.limit, select: select})
    if (adminsPage.totalPages > query.page) { throw new NotFoundException("Page not found") }
    return adminsPage
  }

  async getUser(userId: string, select?: string): Promise<User> {
    select = select || ""
    const user = await this.userModel.findById(userId).select(select).exec()
    if (!user) { throw new NotFoundException("User not found") }
    return user
  }

  async findUser(properties: Object, select?: string): Promise<User> {
    select = select || ""
    const user = await this.userModel.findOne(properties).select(select).exec()
    if (!user) { throw new NotFoundException("User not found") }
    return user
  }

  async updateUser(userId: string, dto: UpdateUserBodyDto, select?: string): Promise<User> {
    select = select || ""
    await this.getUser(userId)
    return await this.userModel.findByIdAndUpdate(userId, dto).select(select).exec()
  }

  async deleteUser(userId: string) {
    await this.getUser(userId)
    await this.userModel.findByIdAndDelete(userId).exec()
    return
  }

  async addRoleToUser(userId: string, role: string): Promise<User> {
    const user = await this.getUser(userId, "roles")
    if (user.roles.includes(role)) { throw new BadRequestException("User already has this role") }
    user.roles.push(role)
    await this.userModel.findByIdAndUpdate(userId, user).exec()
    return
  }

  async removeRoleFromUser(userId: string, role: string): Promise<User> {
    const user = await this.getUser(userId, "roles")
    if (!user.roles.includes(role)) { throw new BadRequestException("User does not have this role") }
    user.roles = user.roles.filter(function(userRole) { return userRole !== role })
    await this.userModel.findByIdAndUpdate(userId, user).exec()
    return
  }

  async getUserRoles(userId: string): Promise<string[]> {
    const user = await this.getUser(userId, "roles")
    return user.roles
  }
}