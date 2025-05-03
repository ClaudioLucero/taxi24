import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './infrastructure/swagger/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Convierte cadenas a tipos esperados (por ejemplo, "40.7128" a 40.7128)
      transformOptions: { enableImplicitConversion: true }, // Habilita conversión implícita
    })
  );
  setupSwagger(app);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
