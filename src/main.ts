import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { ValidationPipe } from "@nestjs/common"
import { AppService } from "./app.service"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const config = new DocumentBuilder()
  .setTitle("AMS API")
  .setDescription("AMS API Documentation")
  .setVersion("1.0")
  .addBearerAuth()
  .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("api-docs", app, document)
  app.get(AppService).setup()
  app.enableCors({ origin: "http://localhost:4000", methods: "*", allowedHeaders: "Content-Type, Authorization" })
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()