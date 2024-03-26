import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

import { LogPath, AppLogger } from './appLogger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder().setTitle('REST service').setDescription('The REST service API description').setVersion('1.0').addTag('library').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  const port = process.env.PORT || 4000;

  await app.listen(port);

  AppLogger.info(`logger is initialized, file is here ${LogPath}`);
  AppLogger.info(`app listens on port ${port}`);
  AppLogger.info(`swagger is here  http://localhost:${port}/doc/`);
}
bootstrap();
