# Kinemo Cinema Frontend

Aplicación Vue 3 conectada al backend real de Kinemo mediante `/api/v1`.

## Ejecución local

1. Instala Node.js compatible con Vite 8 (20.19+ o 22.12+).
2. Descarga también [kinemo-platform](https://github.com/kinemo-cinema/kinemo-platform/tree/local-backend-integration), en la rama `local-backend-integration`.
3. Sigue su `LOCAL-DEVELOPMENT.md` para configurar MySQL con tus propias credenciales y arrancar la API en `http://localhost:5089`.
4. Desde la carpeta de este frontend ejecuta:

```sh
npm install
npm run dev
```

Abre `http://localhost:5173`. Vite redirige las peticiones `/api` al backend del puerto 5089. No es necesario ejecutar `mock:api`.

## Datos compartidos

`kinemo.sql` es una exportación de la estructura y los registros locales realizada el 11 de noviembre de 2026. No contiene la contraseña de MySQL. La importación es opcional: sin ella, el backend puede crear su esquema vacío. Revisa la base de destino antes de importar, porque el dump incluye instrucciones para reemplazar tablas existentes de `kinemo-platform-wa`.

No se incluyen `node_modules`, compilaciones, la instalación portátil de MySQL ni archivos locales de credenciales.

## Documentación

- [INTEGRATION-AUDIT.md](INTEGRATION-AUDIT.md): funciones conectadas, pruebas y límites del backend.
- [LOCAL-DEVELOPMENT.md](LOCAL-DEVELOPMENT.md): configuración del entorno original y comandos de desarrollo.

Mantenimiento y asientos todavía no tienen implementación en el backend. Pagos y sincronización externa requieren proveedores reales y no generan resultados simulados.

## Comprobaciones

```sh
npm run build
node scripts/check-local-integration.mjs
```

Los scripts de pruebas de escritura necesitan una base aislada y los servidores de verificación indicados en `INTEGRATION-AUDIT.md`; no deben ejecutarse contra datos reales.
