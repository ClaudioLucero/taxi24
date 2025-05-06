import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

// Configura Swagger para generar documentación de la API
export const setupSwagger = (app: INestApplication) => {
  // Define la configuración básica de la documentación de Swagger
  const config = new DocumentBuilder()
    .setTitle('Taxi24 API')
    .setDescription('API REST para gestión de transporte')
    .setVersion('1.0')
    .build();
  // Crea el documento de Swagger basado en la aplicación y la configuración
  const document = SwaggerModule.createDocument(app, config);
  // Configura la ruta '/api-docs' para acceder a la interfaz de Swagger
  SwaggerModule.setup('api-docs', app, document);
};
