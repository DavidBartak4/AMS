import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { ValidationPipe } from "@nestjs/common"
import { AppService } from "./app.service"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const appService = app.get(AppService)
  await appService.setupApp({url: "http://localhost:3000"})
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
  app.enableCors({ origin: "http://localhost:4000", methods: "*", allowedHeaders: "Content-Type, Authorization" })
  await app.listen(3000)
}

bootstrap()