import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { ValidationPipe } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { config } from "process"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
  app.enableCors({ origin: "http://localhost:4000", methods: "*", allowedHeaders: "Content-Type, Authorization" })
  await app.listen(3000)
  let url = await app.getUrl()
  url = url.replace("[::1]", "localhost")
  app.get(ConfigService).set("url", url)
}

bootstrap()