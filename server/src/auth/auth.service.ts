import { ConflictException, Injectable, NotFoundException, UnauthorizedException} from "@nestjs/common"
import { UsersService } from "../users/users.service"
import { SignupBodyDto } from "./dto/signup.dto"
import { LoginBodyDto } from "./dto/login.dto"
import * as bcrypt from "bcryptjs"
import { User } from "src/users/schemas/user.schema"
import { JwtService } from "./jwt.service"
import { UpdateUserCredentialsBodyDto } from "./dto/update.userCredentials.dto"

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

  async signup(body: SignupBodyDto): Promise<{user: User, access_token: string}> {
    try { 
      await this.usersService.findUser({ username: body.username }) 
      throw new ConflictException("Username is already taken")
    } catch(err) {
      if (err instanceof NotFoundException) {
        body.password = await this.hashPassword(body.password)
        const user = await this.usersService.createUser(body)
        const token = this.generateToken(user)
        user.password = undefined
        return { user: user, access_token: token }
      } else {
        throw err
      }
    }
  }

  async login(body: LoginBodyDto): Promise<{user: User, access_token: string}> {
    try {
      const user = await this.usersService.findUser({ username: body.username })
      await this.validateCredentials(body.username, body.password)
      const token = this.generateToken(user)
      user.password = undefined
      return { user: user, access_token: token }     
    } catch (err) {
      throw err
    }
  }
  
  async updateCredentials(userId: string, body: UpdateUserCredentialsBodyDto): Promise<User> {
    body.password = await this.hashPassword(body.password)
    await this.usersService.updateUser(userId, body)
    return
  }

  private async validateCredentials(username, password): Promise<void> {
    const user = await this.usersService.findUser({ username: username })
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) { throw new UnauthorizedException("Invalid credentials") }
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