import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cho phép web (khác port = khác origin) gọi API
  app.enableCors({ origin: (process.env.CORS_ORIGINS ?? 'http://localhost:3000').split(',') });

  const port = Number(process.env.PORT ?? 8080);
  await app.listen(port, '0.0.0.0');
  console.log(`todo-api [env=${process.env.APP_ENV ?? 'local'} version=${process.env.APP_VERSION ?? 'dev'}] listening on :${port}`);
}

bootstrap();
