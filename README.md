Taxi24 es una API RESTful diseñada para una startup que ofrece una solución de marca blanca para gestionar flotas de transporte. Permite a otras empresas administrar conductores, pasajeros, viajes y facturas a través de endpoints accesibles sin autenticación. Desarrollada con NestJS, TypeScript, PostgreSQL y PostGIS, la API soporta cálculos geoespaciales para encontrar conductores cercanos y sigue Clean Architecture para garantizar mantenibilidad y escalabilidad.

Funcionalidades Principales
Conductores: Listar todos los conductores, los disponibles, y los cercanos a una ubicación (radio de 3 km).
Viajes: Crear solicitudes de viaje, completarlas con generación automática de facturas, y listar viajes activos.
Pasajeros: Listar pasajeros, obtener detalles por ID, y buscar conductores cercanos.
Facturas: Consultar facturas por viaje o con filtros (pasajero, conductor, fechas).
Documentación: Swagger en /api-docs con ejemplos y pruebas interactivas.

Requisitos Previos
Node.js: v20.17.0 o superior
npm: v10.8.2 o superior
PostgreSQL: v16.8 con la extensión PostGIS habilitada

Instalación y Configuración

1. Clonar el Repositorio
   bash
   git clone https://github.com/ClaudioLucero/taxi24.git
   cd taxi24
2. Instalar Dependencias
   bash
   npm install
3. Configurar Variables de Entorno
   Crea un archivo .env en la raíz del proyecto con las siguientes variables:
   env

# URL de conexión a la base de datos PostgreSQL (ajusta user, password, host, port, y database según tu entorno)

DATABASE_URL=postgresql://taxi24:taxi24@localhost:5433/taxi24

# URL para la base de datos de pruebas (usada en pruebas de integración)

TEST_DATABASE_URL=postgresql://taxi24:taxi24@localhost:5433/taxi24_test

# Puerto en el que se ejecutará la API

PORT=3000

# Duración en segundos para el límite de solicitudes (60 segundos = 1 minuto)

THROTTLE_TTL=60

# Número máximo de solicitudes permitidas por IP en el período definido por THROTTLE_TTL

THROTTLE_LIMIT=100
Explicación de las Variables de Entorno:
DATABASE_URL: Especifica la conexión a la base de datos PostgreSQL para la aplicación principal.
TEST_DATABASE_URL: Define la conexión a la base de datos de pruebas para pruebas de integración.
PORT: Puerto donde la API escucha solicitudes HTTP (por defecto, 3000).
THROTTLE_TTL: Tiempo en segundos durante el cual se aplica el límite de solicitudes por IP. Un valor de 60 indica que el límite se reinicia cada minuto.
THROTTLE_LIMIT: Máximo número de solicitudes permitidas por IP en el período definido por THROTTLE_TTL. Un valor de 100 permite hasta 100 solicitudes por minuto por IP, protegiendo la API contra uso excesivo. 4. Configurar la Base de Datos

Asegúrate de que PostgreSQL esté ejecutándose y habilita la extensión PostGIS:
sql
CREATE EXTENSION IF NOT EXISTS postgis;
Crea las bases de datos para la aplicación y pruebas:
sql
CREATE DATABASE taxi24;
CREATE DATABASE taxi24_test; 5. Ejecutar Migraciones
Aplica las migraciones para crear las tablas y poblar los datos iniciales:
bash
npm run migration:run
Para las pruebas, ejecuta las migraciones en la base de datos de pruebas:
bash
npm run migration:run:test

Ejecución
Ejecución Local
Inicia la API en modo desarrollo:
bash
npm run start:dev
La API estará disponible en http://localhost:3000. Accede a la documentación Swagger en http://localhost:3000/api-docs.



Endpoints Principales
Método
Endpoint
Descripción
GET
/drivers
Lista todos los conductores.
GET
/drivers/available
Lista conductores disponibles.
GET
/drivers/nearby?latitude={lat}&longitude={lng}&radius={km}
Lista conductores cercanos a una ubicación.
POST
/trips
Crea un nuevo viaje, asignando un conductor.
PATCH
/trips/:id/complete
Completa un viaje y genera una factura.
GET
/trips/active
Lista viajes activos con paginación.
GET
/passengers
Lista todos los pasajeros.
GET
/passengers/:id
Obtiene detalles de un pasajero.
GET
/passengers/:id/nearby-drivers
Busca conductores cercanos al pasajero.
GET
/trips/:id/invoice
Obtiene la factura de un viaje.
GET
/invoices
Lista facturas con filtros (pasajero, conductor, fechas).
Consulta la documentación completa en http://localhost:3000/api-docs.

Pruebas
El proyecto incluye pruebas unitarias y de integración para los módulos principales (conductores, viajes, pasajeros, facturas).
Ejecuta todas las pruebas:
bash
npm run test
Verifica la cobertura de pruebas:
bash
npm run test:cov
Ejecuta pruebas de integración:
bash
npm run test:integration

Notas Adicionales
Arquitectura: Sigue Clean Architecture, con capas separadas para casos de uso (application), entidades (domain), y controladores/repositorios (infrastructure).
Datos Iniciales: Incluye datos de prueba (3 conductores, 2 pasajeros, 2 viajes, 1 factura) para probar todas las funcionalidades.
Limitaciones: No requiere autenticación, por lo que todos los endpoints son accesibles públicamente, según los requerimientos.

Mejoras Pendientes:
Obtener dinámicamente la ubicación del pasajero en GET /passengers/:id/nearby-drivers.
Añadir un índice GIST en DRIVERS.location para optimizar consultas geoespaciales.
