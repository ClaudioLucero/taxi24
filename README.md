# 🚖 Taxi24 API


**Taxi24** es una API RESTful diseñada para una startup que ofrece una solución *white label* para la gestión de flotas de transporte. Permite a otras empresas administrar conductores, pasajeros, viajes y facturas mediante endpoints públicos sin autenticación.

Desarrollada con **NestJS**, **TypeScript**, **PostgreSQL** y **PostGIS**, esta API soporta cálculos geoespaciales para encontrar conductores cercanos y sigue los principios de **Clean Architecture** para mantener la escalabilidad y mantenibilidad.

---

## 🧩 Tecnologías

- **Node.js** v20.17.0 o superior  
- **npm** v10.8.2 o superior  
- **PostgreSQL** v16.8 con **PostGIS**

---

## 🚀 Funcionalidades Principales

- **Conductores**
  - Listar todos los conductores
  - Listar conductores disponibles
  - Buscar conductores cercanos (radio de 3 km)

- **Viajes**
  - Crear solicitudes de viaje
  - Completar viajes con generación automática de facturas
  - Listar viajes activos

- **Pasajeros**
  - Listar todos los pasajeros
  - Obtener detalles por ID
  - Buscar conductores cercanos a un pasajero

- **Facturas**
  - Consultar factura por ID de viaje
  - Filtrar facturas por pasajero, conductor o rango de fechas

- **Documentación interactiva con Swagger**:  
  Disponible en [`/api-docs`](http://localhost:3000/api-docs)

---

## ⚙️ Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/ClaudioLucero/taxi24.git
cd taxi24
```
2. Instalar dependencias
npm install

3. Variables de entorno
```bash
# Base de datos principal
DATABASE_URL=postgresql://taxi24:taxi24@localhost:5433/taxi24

# Base de datos para pruebas
TEST_DATABASE_URL=postgresql://taxi24:taxi24@localhost:5433/taxi24_test

# Puerto de la API
PORT=3000

# Límite de peticiones (Throttle)
THROTTLE_TTL=60
THROTTLE_LIMIT=100
```




4. Configurar la base de datos
Asegúrate de tener PostgreSQL corriendo. Luego:
-- Habilitar PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- Crear bases de datos
CREATE DATABASE taxi24;
CREATE DATABASE taxi24_test;

5. Ejecutar migraciones

Ejecución
Modo desarrollo
npm run start:dev

 Endpoints Principales
 # Migraciones para base principal
npm run migration:run

# Migraciones para entorno de pruebas
npm run migration:run:test



| Método | Endpoint                                               | Descripción                             |
| ------ | ------------------------------------------------------ | --------------------------------------- |
| GET    | `/drivers`                                             | Lista todos los conductores             |
| GET    | `/drivers/available`                                   | Lista conductores disponibles           |
| GET    | `/drivers/nearby?latitude=LAT&longitude=LNG&radius=KM` | Conductores cercanos a una ubicación    |
| POST   | `/trips`                                               | Crear un nuevo viaje                    |
| PATCH  | `/trips/:id/complete`                                  | Completar viaje y generar factura       |
| GET    | `/trips/active`                                        | Listar viajes activos                   |
| GET    | `/passengers`                                          | Listar todos los pasajeros              |
| GET    | `/passengers/:id`                                      | Obtener detalles de un pasajero         |
| GET    | `/passengers/:id/nearby-drivers`                       | Buscar conductores cercanos al pasajero |
| GET    | `/trips/:id/invoice`                                   | Obtener factura de un viaje             |
| GET    | `/invoices`                                            | Listar facturas con filtros             |



Pruebas
Este proyecto incluye pruebas unitarias y de integración.

Ejecutar todas las pruebas:

npm run test

npm run test:cov

npm run test:integration



