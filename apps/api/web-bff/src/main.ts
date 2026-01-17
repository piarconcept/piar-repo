import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for web client
  app.enableCors({
    origin: process.env.WEB_CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  });

  const port = process.env.PORT || 5000;
  await app.listen(port);
  
  console.warn(`🚀 Web BFF is running on: http://localhost:${port}`);
}

bootstrap();
