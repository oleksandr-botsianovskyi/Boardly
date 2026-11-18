import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import check_connection from './prisma/check-connection.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });
  check_connection();
  await app.listen(process.env.PORT ?? 3001);
}
await bootstrap();
