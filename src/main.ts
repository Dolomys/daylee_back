import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';
import { MongoExceptionFilter } from 'utils/mongoExceptions';
import { AppModule } from './app.module';
import { SocketIoAdapter } from './chat/socket-io-adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService)
  app
    .useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    )
    .useGlobalFilters(new MongoExceptionFilter())
    .useWebSocketAdapter(new SocketIoAdapter(app, configService))

  const config = new DocumentBuilder()
    .setTitle('Daylee')
    .setDescription('Daylee API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/doc', app, document);

  await app.listen(3000);
}
bootstrap();
