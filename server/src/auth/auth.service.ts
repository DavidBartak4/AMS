import { ConflictException, Injectable, OnModuleInit, UnauthorizedException} from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { UsersService } from "../users/users.service"
import { SignupDto } from "./dto/signup.dto"
import { LoginDto } from "./dto/login.dto"
import * as bcrypt from "bcryptjs"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { Auth, AuthDocument } from "./schemas/auth.schema"
import { randomBytes } from "crypto"

@Injectable()
export class AuthService implements OnModuleInit {
  jwtSecret: string
  constructor(@InjectModel(Auth.name) private authModel: Model<AuthDocument>, private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

  async onModuleInit() {
    let auth = await this.authModel.findOne()
    if (!auth) {
      auth = await this.authModel.create({ jwtSecret: randomBytes(32).toString("hex") })
    }
    this.jwtSecret = auth.jwtSecret
    console.log(this.jwtService, 200)
  }

  async signup(dto: SignupDto) {
    const { username, password } = dto
    const existingUser = await this.usersService.findUserByUsername(username)
    if (existingUser) {
      throw new ConflictException("Username is already taken")
    }
    const user = await this.usersService.createUser({
      username: username,
      password: password,
    })
    const token = this.generateToken(user)
    return {
      user: {
        _id: user._id,
        username: user.username
      },
      access_token: token
    }
  }

  async login(dto: LoginDto) {
    const { username, password } = dto
    const user = await this.usersService.findUserByUsername(username)
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException("invalid credentials")
    }
    const token = this.generateToken(user)
    return {
      user: {
        _id: user._id,
        username: user.username
      },
      access_token: token
    }
  }

  private generateToken(user: any) {
    const payload = {
      sub: user._id,
      username: user.username,
      roles: user.roles,
    }
    return this.jwtService.sign(payload, { secret: "123", expiresIn: "1h" }) //this.jwtSecret, expiresIn: "1h" })
  }
}