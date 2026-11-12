# Verificación de integración local — 11 de noviembre de 2026

## Resultado comprobado

Frontend activo en http://localhost:5173 y backend activo en http://localhost:5089, con MySQL real en 127.0.0.1:3306. No se usa json-server ni se importó server/db.json.

La base real `kinemo-platform-wa` conserva una película: ID 1, título `jj`, duración 0, género SciFi y estado Active, con su contenido sensorial asociado. No se corrigió ese dato existente automáticamente. Salas, funciones, planes, suscripciones, integraciones y ejecuciones tienen cero registros en la consulta final. Todos esos listados respondieron 200 a través del proxy del frontend.

## Módulos conectados

| Módulo | Comportamiento actual |
| --- | --- |
| Películas | Listar, crear, editar y desactivar con la API real. Formulario espera confirmación del servidor, conserva errores y carga los géneros. La duración se guarda mediante un campo numérico nativo validado; Chrome verificó 100 minutos persistidos y la edición posterior. |
| Géneros | Lectura del enum real del backend; la pantalla ya no ofrece un CRUD inexistente. |
| Salas | Listar y crear. En detalle: leer inspecciones/bloqueos, registrar preparación, bloquear por período y liberar. Se retiraron las acciones de edición/borrado que no tiene el backend. |
| Funciones | Listado, alta, edición de fechas y cancelación. Fechas StartDateTime/EndDateTime adaptadas; formularios esperan guardado y conservan errores. |
| Contenido sensorial | Consulta agrupada por película de pistas, estado y configuración; carga multipart de archivos y cambio del perfil de intensidad. Los enlaces anteriores de archivos/pistas/historial llevan a esta vista conectada, conservando los archivos originales de las vistas anteriores. |
| Ticketing | Listar y registrar integraciones, leer logs y ocupación persistida por función. Sincronización externa deshabilitada hasta integrar un proveedor real; el backend ya no inventa ocupaciones. |
| Ejecución | Listar, iniciar desde una función, pausar, reanudar, finalizar y registrar una parada de emergencia. Se muestran los hijos persistidos: secuencias, logs y emergencias. |
| Suscripciones | Planes reales y contratación; gestión en `/subscriptions/manage`, con listado, historial y cambio de plan. Pagos deshabilitados: no hay pasarela real configurada y el endpoint devuelve 503 sin registrar una transacción simulada. |
| Analytics | Vista en `/analytics`: consulta del último dashboard o por ID, generación por período y consulta/generación de metadatos de reportes. Las métricas usan funciones reales, no las cifras fijas anteriores. La utilización y horas son planificadas; incidentes se cuentan desde las paradas de emergencia registradas. El backend no expone descarga de archivos de reportes. |
| Mantenimiento y asientos | No existen sus servicios/controladores implementados en este backend. Se informa indisponibilidad y no se consultan rutas del mock ni se presentan ceros como si se hubieran cargado. |

## Cambios en el backend

- Configuración local Development ignorada por Git; se conservó el appsettings versionado original. Redirección HTTPS desactivada solo en Development.
- GET /movies/genres sobre el enum existente.
- Swagger corregido para tipos con nombres repetidos.
- Nuevos GET /ticketing/integrations, /executions y /subscriptions, mediante queries, servicios y repositorios, incluyendo relaciones almacenadas.
- Analytics calcula métricas desde funciones/salas/ejecuciones guardadas y valida el período solicitado.
- El proveedor externo simulado de ticketing dejó de estar registrado. Sin proveedor real, se conserva el error de sincronización sin fabricar ocupación.
- El procesamiento de pagos simulado se sustituyó por indisponibilidad explícita, sin cargos ni transacciones artificiales.
- No se alteró el esquema de la base real ni se borraron o sobrescribieron registros existentes durante esta revisión. El esquema local había sido creado anteriormente por el EnsureCreated original del backend.

## Pruebas ejecutadas

- Compilación del backend: correcta, sin advertencias ni errores.
- `npm run build` y `node scripts/check-local-integration.mjs`: correctos.
- 41 peticiones de integración verificadas mediante el proxy de un frontend separado en 5174 y una API en 5090, usando exclusivamente la base `kinemo-integration-check-20261111`: altas/lectura/edición, errores por duplicados/conflictos, preparación/bloqueo/liberación de salas, archivo sensorial/perfil, pausa/reanudación/finalización/emergencia, suscripciones/cambio de plan y analytics calculado desde las funciones guardadas.
- Chrome: 15 pantallas de la copia aislada sin errores de JavaScript ni consultas fallidas; alta y edición de película desde la interfaz con lectura posterior de MySQL.
- Chrome: las mismas 15 pantallas de la aplicación real en modo solo lectura, sin modificar sus datos.
- Prueba de proveedor no configurado: no se crea ocupación ficticia. Prueba de pago: 503 y cero transacciones nuevas.
- Se retiraron los servidores y la base de prueba al terminar. No se incorporaron sus registros a la base real.

## Repetir comprobaciones

Con la aplicación real y Chrome de diagnóstico en el puerto 9223:

```powershell
node scripts/check-browser-integration.mjs --read-only
node scripts/check-local-integration.mjs
npm run build
```

`check-live-integration.mjs` y la modalidad de escritura de `check-browser-integration.mjs` están restringidos a los servidores aislados en 5090/5174. No deben apuntarse a la base real. La prueba de suscripciones necesita dos planes preparados exclusivamente en esa base aislada.

El conflicto del encabezado se marcó resuelto sin hacer commit. Se conservaron los cambios previos del usuario, incluidas las tarjetas de analytics; no se publicaron cambios.
