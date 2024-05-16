import { NestFactory } from '@nestjs/core';
import { swaggerConfig } from './internal/application/configs/swagger.config';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { env } from './internal/application/configs/env';

async function bootstrap() {
  console.time('Start app');
  
  const app = await NestFactory.create(AppModule);
  
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/', app, document);
  
  await app.listen(env.port);

  console.timeEnd('Start app');
}
bootstrap();
