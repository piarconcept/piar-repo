import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for backoffice client
  app.enableCors({
    origin: process.env.BACKOFFICE_CLIENT_URL || 'http://localhost:3001',
    credentials: true,
  });

  const port = process.env.PORT || 5050;
  await app.listen(port);
  
  console.warn(`🚀 Backoffice BFF is running on: http://localhost:${port}`);
}

bootstrap();
