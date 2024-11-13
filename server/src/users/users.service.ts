import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { User, UserDocument } from "./schemas/user.schema"

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: any): Promise<User> {
    return this.userModel.create(createUserDto)
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.userModel.findOne({ username }).exec()
  }
 
  async deleteUser(id: string): Promise<any> {
    return this.userModel.findByIdAndDelete(id).exec()
  }

  async findRoles(username: string): Promise<string[]> {
    const user = await this.findOne(username)
    return user ? user.roles : []
  }
}