import { Module } from "@nestjs/common"
import { PassportModule } from "@nestjs/passport"
import { AuthService } from "./auth.service"
import { AuthController } from "./auth.controller"
import { JwtStrategy } from "./jwt.strategy"
import { UsersModule } from "../users/users.module"
import { JwtService } from "./jwt.service"
import { getModelToken, MongooseModule } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { Auth, AuthSchema } from "./schemas/auth.schema"
import { randomBytes } from "crypto"

@Module({
  imports: [
    UsersModule,
    PassportModule,
    MongooseModule.forFeature([{ name: Auth.name, schema: AuthSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, {
    provide: JwtService,
    useFactory: async function(authModel: Model<any>) {
      let auth = await authModel.findOne().exec()
      if (!auth) {
        auth = await authModel.create({ jwtSecret: randomBytes(32).toString("hex") })
      }
      return new JwtService({ secret: auth.jwtSecret, signOptions: { expiresIn: "1h" } })
    },
    inject: [getModelToken(Auth.name)]
  }],
  exports: [AuthService],
})
export class AuthModule {}