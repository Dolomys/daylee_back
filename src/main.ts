import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';
import { AsyncApiDocumentBuilder, AsyncApiModule } from 'nestjs-asyncapi';
import { AppModule } from './app.module';
import { EnvironmentVariables } from './utils/config/configuration';
import { MongoExceptionFilter } from './utils/mongoExceptions';
import { SocketIoAdapter } from './utils/sockets/socket-io-adapter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
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

  const asyncApiOptions = new AsyncApiDocumentBuilder()
    .setTitle('Daylee')
    .setDescription('Daylee server sockets')
    .setVersion('1.0')
    .addServer('daylee-sockets', {
      url: '/chat',
      protocol: 'socket.io',
  })
    .addBearerAuth()
    .build();

  const asyncapiDocument = await AsyncApiModule.createDocument(app, asyncApiOptions);
  await AsyncApiModule.setup('socket/doc', app, asyncapiDocument);

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
