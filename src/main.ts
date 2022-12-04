import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as config from 'config';
import { AppModule } from './app.module';
import { ValidationPipe } from './Common/pipes/validation.pipe';
import { HttpExceptionFilter } from './Common/filters/httpException.filter';
import { LoggingInterceptor } from './Common/Interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe())

  app.useGlobalInterceptors(new LoggingInterceptor())

  app.useGlobalFilters(new HttpExceptionFilter())

  app.enableCors();

  const PORT = process.env.PORT || config.get('PORT');
  await app.listen(PORT);
  Logger.log(`Server Running On [ http://localhost:${PORT} ] `, 'Bootstrap');
}
bootstrap();
