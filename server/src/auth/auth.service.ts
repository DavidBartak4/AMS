import { ConflictException, Injectable, NotFoundException, UnauthorizedException} from "@nestjs/common"
import { UsersService } from "../users/users.service"
import { SignupBodyDto } from "./dto/signup.dto"
import { LoginBodyDto } from "./dto/login.dto"
import * as bcrypt from "bcryptjs"
import { User } from "src/users/schemas/user.schema"
import { JwtService } from "./jwt.service"

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

  async signup(body: SignupBodyDto) {
    try { 
      await this.usersService.findUser({ username: body.username }) 
      throw new ConflictException("Username is already taken")
    } catch(err) {
      if (err instanceof NotFoundException) {
        body.password = await bcrypt.hash(body.password, 10)
        const user = await this.usersService.createUser(body)
        const token = this.generateToken(user)
        user.password = undefined
        return { user: user, access_token: token }
      } else {
        throw err
      }
    }
  }

  async login(body: LoginBodyDto) {
    try {
      const user = await this.usersService.findUser({ username: body.username })
      const isValidPassword = await bcrypt.compare(body.password, user.password)
      if (!isValidPassword) { throw new UnauthorizedException("Invalid credentials") }
      const token = this.generateToken(user)
      user.password = undefined
      return { user: user, access_token: token }     
    } catch (err) {
      throw err
    }
  }

  private generateToken(user: User) {
    return this.jwtService.sign({
      sub: user._id,
      username: user.username,
      roles: user.roles,
    })
  }
}