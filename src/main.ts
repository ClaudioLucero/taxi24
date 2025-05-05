import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './infrastructure/swagger/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      forbidNonWhitelisted: true, // Rechazar propiedades no definidas
      whitelist: true, // Eliminar propiedades no esperadas
      forbidUnknownValues: true, // Rechazar valores no válidos
      stopAtFirstError: true, // Detenerse en el primer error
    }),
  );
  setupSwagger(app);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();