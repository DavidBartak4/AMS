import { Injectable, UnauthorizedException } from "@nestjs/common"
import { UsersService } from "../users/users.service"
import { SignupBodyDto } from "./dto/signup.dto"
import { LoginBodyDto } from "./dto/login.dto"
import { User } from "src/users/schemas/user.schema"
import { JwtService } from "./jwt.service"
import { UpdateUserCredentialsBodyDto } from "./dto/update.userCredentials.dto"
import * as bcrypt from "bcryptjs"

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

  async signup(body: SignupBodyDto): Promise<{user: User, access_token: string}> {
    body.password = await this.hashPassword(body.password)
    const user = await this.usersService.createUser(body)
    const token = this.generateToken(user)
    user.password = undefined
    return { user: user, access_token: token }
  }

  async login(body: LoginBodyDto): Promise<{user: User, access_token: string}> {
    const user = await this.validateCredentials(body.username, body.password)
    const token = this.generateToken(user)
    user.password = undefined
    return { user: user, access_token: token } 
  }
  
  async updateCredentials(userId: string, body: UpdateUserCredentialsBodyDto): Promise<User> {
    if (body.password) { body.password = await this.hashPassword(body.password) }
    await this.usersService.updateUser(userId, body)
    return
  }

  async validateCredentials(username: string, password: string): Promise<User> {
    const user = await this.usersService.findUser({ username: username})
    const isValidCredentials = await bcrypt.compare(password, user.password)
    if (!isValidCredentials) { throw new UnauthorizedException("Invalid credentials") }
    return user
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10)
  }

  private generateToken(user: User): string {
    return this.jwtService.sign({
      sub: user._id,
      username: user.username,
      roles: user.roles,
    })
  }
}