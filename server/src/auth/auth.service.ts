import { Injectable } from "@nestjs/common"
import { UsersService } from "../users/users.service"
import { SignupBodyDto } from "./dto/signup.dto"
import { LoginBodyDto } from "./dto/login.dto"
import { User } from "src/users/schemas/user.schema"
import { JwtService } from "./jwt.service"

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

  async signup(body: SignupBodyDto): Promise<{user: User, access_token: string}> {
    const user = await this.usersService.createUser(body)
    const token = this.generateToken(user)
    return { user: user, access_token: token }
  }

  async login(body: LoginBodyDto): Promise<{user: User, access_token: string}> {
    const user = await this.usersService.authenticate(body.username, body.password)
    const token = this.generateToken(user)
    return { user: user, access_token: token } 
  }

  private generateToken(user: User): string {
    return this.jwtService.sign({
      sub: user._id,
      username: user.username,
      roles: user.roles,
    })
  }
}