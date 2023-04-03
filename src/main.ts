import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';
import { AppModule } from './app.module';
import { EnvironmentVariables } from './utils/config/configuration';
import { MongoExceptionFilter } from './utils/mongoExceptions';
import { SocketIoAdapter } from './utils/sockets/socket-io-adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<EnvironmentVariables, true>);

  app
    .useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    )
    .useGlobalFilters(new MongoExceptionFilter())
    .useWebSocketAdapter(new SocketIoAdapter(app));

  const config = new DocumentBuilder()
    .setTitle('Daylee')
    .setDescription('Daylee API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/doc', app, document);

  await app.listen(configService.get('PORT'));
}
bootstrap();
