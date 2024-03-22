import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder().setTitle('REST service').setDescription('The REST service API description').setVersion('1.0').addTag('library').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  const port = process.env.PORT || 4000;

  await app.listen(port);
  console.log(`app listens on port ${port}`);
  console.log(`swagger is here  http://localhost:${port}/doc/`);
}
bootstrap();
