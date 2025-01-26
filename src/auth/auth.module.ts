import { Module } from "@nestjs/common"
import { UsersModule } from "src/users/users.module"
import { PassportModule } from "@nestjs/passport"
import { JwtStrategy } from "./jwt/strategy.jwt"
import { JwtModule } from "@nestjs/jwt"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"

@Module({
  imports: [
    UsersModule, 
    PassportModule, 
    UsersModule,
    JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async function (configService: ConfigService) {
            return {
                secret: configService.get("JWT_SECRET"),
                signOptions: { expiresIn: "1h" }
            }
        }
    })
],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}