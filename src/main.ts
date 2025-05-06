import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './infrastructure/swagger/swagger.config';

async function bootstrap() {
  // Crea una instancia de la aplicación NestJS basada en el módulo raíz AppModule
  const app = await NestFactory.create(AppModule);

  // Configura validaciones globales para los datos de entrada (DTOs)
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Convierte automáticamente los tipos (por ejemplo, string a number)
      transformOptions: { enableImplicitConversion: true }, // Permite conversiones implícitas para parámetros
      forbidNonWhitelisted: true, // Rechaza propiedades no definidas en los DTOs
      whitelist: true, // Elimina propiedades no incluidas en los DTOs
      forbidUnknownValues: true, // Rechaza objetos desconocidos o vacíos
      stopAtFirstError: true, // Detiene la validación al encontrar el primer error
    })
  );

  // Configura Swagger para generar documentación interactiva de la API
  setupSwagger(app);

  // Inicia el servidor en el puerto especificado en variables de entorno o en el puerto 3000 por defecto
  await app.listen(process.env.PORT || 3000);
}

// Ejecuta la función bootstrap para iniciar la aplicación
bootstrap();
