// src/infrastructure/swagger/swagger.config.ts
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

// Configura Swagger para generar documentación detallada de la API
export const setupSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Taxi24 API')
    .setDescription(
      'API REST para la gestión de transporte, que permite administrar conductores, pasajeros, viajes y facturas en una plataforma de movilidad.'
    )
    .setVersion('1.0')
    .setContact('Equipo Taxi24', 'https://taxi24.com', 'soporte@taxi24.com')
    .addTag('Conductores', 'Gestión de conductores: listar, filtrar por disponibilidad o ubicación.')
    .addTag('Pasajeros', 'Gestión de pasajeros: crear, listar, buscar conductores cercanos.')
    .addTag('Viajes', 'Gestión de viajes: crear, listar, completar, consultar facturas.')
    .addTag('Facturas', 'Gestión de facturas: listar con filtros, obtener por viaje.')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      tryItOutEnabled: true, // Habilita "Try it out" para probar endpoints
      filter: true, // Permite filtrar endpoints por tag
      showRequestDuration: true, // Muestra el tiempo de respuesta
    },
  });
};