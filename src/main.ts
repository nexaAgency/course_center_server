import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';
import { getBotToken } from 'nestjs-telegraf';
import { initializeTransactionalContext } from 'typeorm-transactional';

import { AppModule } from './app.module';
import { ENVIRONMENTS } from './common/enums/app.enums';
import { validateEnvironment } from './common/utils/validate-environment.util';
import { configuration } from './config/configuration';

async function bootstrap() {
  initializeTransactionalContext();

  validateEnvironment(process.env);

  const app = await NestFactory.create(AppModule);

  const { app: appConfig } = configuration;

  app.enableCors({
    origin:
      appConfig.environment === ENVIRONMENTS.PRODUCTION
        ? appConfig.webAppUrl
        : '*',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.use(
    ['/docs', '/docs-json'],
    basicAuth({
      challenge: true,
      users: {
        admin: appConfig.swaggerPassword,
      },
    }),
  );

  const bot = app.get(getBotToken());
  app.use(bot.webhookCallback('/telegram'));

  app.setGlobalPrefix('/api', {
    exclude: ['docs', 'docs-json', '/'],
  });

  const config = new DocumentBuilder()
    .setTitle('Course Center API')
    .setDescription('Course Center Description')
    .setVersion('1.0.0')
    .addApiKey(
      { type: 'apiKey', name: 'initdata', in: 'header' },
      'telegram-init-data',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      docExpansion: 'list',
      defaultModelsExpandDepth: 2,
      persistAuthorization: true,
    },
  });

  await app.listen(appConfig.port, appConfig.host, async () => {
    const appUrl = await app.getUrl();

    Logger.log(`Server running on ${appUrl}`);
    Logger.log(`Swagger running on ${appUrl}/docs`);
  });
}
void bootstrap();
