import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Allow all origins (dev only!)
  app.enableCors({
    origin: '*',
  });

  // IMPORTANT: Bind to all network interfaces
  await app.listen(3000);
}

bootstrap();
