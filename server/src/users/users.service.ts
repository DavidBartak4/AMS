import { Injectable, BadRequestException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { User, UserModel } from "./schemas/user.schema"
import { CreateUserBodyDto } from "./dto/create.user.dto"
import { GetAdminsBodyDto, GetAdminsQueryDto } from "./dto/get.admins.dto"
import { UpdateUserBodyDto } from "./dto/update.user.dto"
import { PaginateResult } from "mongoose"
import * as bcrypt from "bcryptjs"
import { InvalidCredentialsException, UserAlreadyHasRoleException, UserAlredyNotHaveRoleException, UsernameAlreadyTakenException, UserNotFoundException } from "./users.exceptions"
import { PageNotFound } from "src/common/exceptions.common"

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) readonly userModel: UserModel) {}

  async createUser(body :CreateUserBodyDto): Promise<User> { 
    const existingUser = await this.userModel.findOne({ username: body.username }).exec()
    if (existingUser) { throw new UsernameAlreadyTakenException }
    body.password = await this.hashPassword(body.password)
    const user = await this.userModel.create(body)
    return await this.userModel.findById(user._id).select("-password").exec()
  }

  async getAdmins(query?: GetAdminsQueryDto, body?: GetAdminsBodyDto): Promise<PaginateResult<User>> {
    query =  query || { page: 1, limit: 10 }
    body = body || {}
    const filter: any = { roles: { $in: ["super-admin", "admin"] } }
    if (body.username) { filter.username = body.partial ? { $regex: body.username, $options: "i" } : body.username }
    const admins = await this.userModel.paginate(filter, { page: query.page, limit: query.limit, select: "-password" })
    if (query.page > admins.totalPages) { throw new PageNotFound }
    return admins
  }

  async getUser(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId).select("-password").exec()
    if (!user) { throw new UserNotFoundException }
    return user
  }

  async updateUser(userId: string, body: UpdateUserBodyDto): Promise<User> {
    const user = await this.userModel.findById(userId).exec()
    if (!user) { throw new UserNotFoundException }
    if (body.username) {
      if (body.username === user.username) {
        throw new BadRequestException("Username cannot be the same as the current username")
      }
      const existingUser = await this.userModel.findOne({ username: body.username }).exec()
      if (existingUser && existingUser.username === body.username) {
        throw new UsernameAlreadyTakenException
      }
      user.username = body.username
    }
    if (body.password) {
      if (await this.comparePasswords(body.password, user.password)) {
        throw new BadRequestException("Password cannot be the same as the current password")
      }
      body.password = await this.hashPassword(body.password) 
      user.password = body.password
    }
    await user.save()
    return await this.userModel.findById(userId).select("-password").exec()
  }

  async deleteUser(userId: string) {
    const user = await this.userModel.findByIdAndDelete(userId).exec()
    if (!user) { throw new UserNotFoundException }
    return
  }

  async addRoleToUser(userId: string, role: string): Promise<User> {
    const user = await this.userModel.findById(userId).exec()
    if (!user) { throw new UserNotFoundException }
    if (user.roles.includes(role)) { throw new UserAlreadyHasRoleException }
    user.roles.push(role)
    await user.save()
    return user
  }

  async removeRoleFromUser(userId: string, role: string): Promise<User> {
    const user = await this.userModel.findById(userId).exec()
    if (!user) { throw new UserNotFoundException }
    if (!user.roles.includes(role)) { throw new UserAlredyNotHaveRoleException }
    user.roles = user.roles.filter(function(userRole) { return userRole !== role })
    await user.save()
    return user
  }

  async getUserRoles(userId: string): Promise<string[]> {
    const user = await this.userModel.findById(userId).exec()
    if (!user) { throw new UserNotFoundException }
    return user.roles
  }

  async authenticate(username: string, password: string): Promise<User> {
    const user = await this.userModel.findOne({ username: username}).exec()
    const isValidCredentials = await bcrypt.compare(password, user.password)
    if (!isValidCredentials) { throw new InvalidCredentialsException }
    return await this.userModel.findById(user._id).select("-password").exec()
  }

  private async comparePasswords(string: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(string, hash)
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10)
  }
}