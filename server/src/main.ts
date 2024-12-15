import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { ValidationPipe } from "@nestjs/common"
import { AppService } from "./app.service"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
  app.enableCors({ origin: "http://localhost:4000", methods: "*", allowedHeaders: "Content-Type, Authorization" })
  const port = 3000
  await app.listen(port)
  const appService = app.get(AppService)
  await appService.setupApp({port: port})
}

bootstrap()