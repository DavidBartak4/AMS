import { NotFoundException, Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { User, UserModel } from "./schemas/user.schema"
import { PostUserBodyDto } from "./dto/post.user.dto"
import * as bcrypt from "bcryptjs"

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: UserModel) {}

  async createUser(dto: PostUserBodyDto) {
    dto.password = await bcrypt.hash(dto.password, 10)
    return await this.userModel.create(dto)
  }

  async findUserByUsername(username: string) {
    return await this.userModel.findOne({ username }).exec()
  }

  async deleteUser(userId: string) {
    const user = await this.userModel.findById(userId).exec()
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} does not exist`)
    }
    return await this.userModel.findByIdAndDelete(userId).exec()
  }

  async addRoleToUser(userId: string, role: string) {
    const user = await this.userModel.findById(userId).exec()
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`)
    }
    if (!user.roles.includes(role)) {
      user.roles.push(role)
      await user.save()
    }
    return user
  }

  async removeRoleFromUser(userId: string, role: string) {
    const user = await this.userModel.findById(userId).exec()
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`)
    }
    const roleIndex = user.roles.indexOf(role)
    if (roleIndex !== -1) {
      user.roles.splice(roleIndex, 1)
      await user.save()
    }
    return user
  }

  async getAdmins(query) {
    const filter: any = { roles: { $in: ["admin", "super-admin"] } }
    if (query.username) {
      filter.username = query.username
    }
    const options = {
      page: query.page || 1,
      limit: query.limit || 10,
    }
    const adminsPage = await this.userModel.paginate(filter, options)
    if (adminsPage.totalPages > options.page) { throw new NotFoundException("page does not exist")}
    return adminsPage
  }

  async getUserRoles(userId: string) {
    const user = await this.userModel.findById(userId).exec()
    return user ? user.roles : []
  }

  async getUser(userId: string) {
    const user = await this.userModel.findById(userId).select("_id username").exec()
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`)
    }
    return user
  }
}