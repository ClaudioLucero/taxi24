## Estructura del Proyecto

La aplicación está organizada en módulos en `src/modules/` para mejorar la modularidad y seguir principios de **Clean Code**:

- **DriversModule**: Gestiona conductores (endpoints `/drivers`).
- **PassengersModule**: Gestiona pasajeros (endpoints `/passengers`).
- **TripsModule**: Gestiona viajes (endpoints `/trips`).
- **InvoicesModule**: Gestiona facturas (endpoints `/invoices`).

Los controladores y repositorios están en `src/infrastructure/controllers/` y `src/infrastructure/repositories/`, respectivamente.

### Pruebas

#### Pruebas Unitarias

```bash
npm run test
```
