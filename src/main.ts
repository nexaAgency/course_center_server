import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from 'swagger.config';
import { setupBot } from 'src/bot/bot.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });

  setupBot(app);
  setupSwagger(app);

  // app.useGlobalFilters(new HttpExceptionFilter());
  // const logger = new Logger('Bootstrap');
  // app.useLogger(logger);
  // app.useWebSocketAdapter(redisIoAdapter);
  // app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
