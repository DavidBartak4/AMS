import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { UsersService } from "../users/users.service"
import { AuthSignupDto } from "./dto/auth.signup.dto"
import { AuthLoginDto } from "./dto/auth.login.dto"
import * as bcrypt from "bcryptjs"

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async signup(authSignupDto: AuthSignupDto) {
    const { username, password } = authSignupDto
    const hashedPassword = await bcrypt.hash(password, 10)
    const existingUser = await this.usersService.findOne(username)
    if (existingUser) {
      throw new ConflictException("Username is already taken")
    }
    const user = await this.usersService.create({ username, password: hashedPassword })
    return this.generateToken(user)
  }

  async login(authLoginDto: AuthLoginDto) {
    const { username, password } = authLoginDto
    const user = await this.usersService.findOne(username)
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException("Invalid credentials")
    }
    return this.generateToken(user)
  }

  generateToken(user: any) {
    const payload = { username: user.username, roles: user.roles }
    return {
      access_token: this.jwtService.sign(payload),
    }
  }
}