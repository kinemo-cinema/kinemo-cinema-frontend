# Kinemo Cinema Frontend

Aplicación Vue 3 conectada al backend real de Kinemo mediante `/api/v1`.

## Ejecución local

1. Instala Node.js compatible con Vite 8 (20.19+ o 22.12+).
2. Descarga también [kinemo-platform](https://github.com/kinemo-cinema/kinemo-platform/tree/develop), en la rama `develop`.
3. Sigue su `LOCAL-DEVELOPMENT.md` para configurar MySQL con tus propias credenciales y arrancar la API en `http://localhost:5089`.
4. Desde la carpeta de este frontend ejecuta:

```sh
npm install
npm run dev
```

Abre `http://localhost:5173`. Vite redirige las peticiones `/api` al backend del puerto 5089. No es necesario ejecutar `mock:api`.

## Datos compartidos

`kinemo.sql` es una exportación de la estructura y los registros locales realizada el 13 de noviembre de 2026. No contiene la contraseña de MySQL. La importación es opcional: sin ella, el backend puede crear su esquema vacío. Revisa la base de destino antes de importar, porque el dump incluye instrucciones para reemplazar tablas existentes de `kinemo-platform-wa`.

El backend requiere .NET SDK 10 y aplica migraciones al arrancar. El dump actualizado incluye su historial de migraciones. No importes este dump sobre datos que quieras conservar; utiliza una base nueva o un respaldo revisado.

No se incluyen `node_modules`, compilaciones, la instalación portátil de MySQL ni archivos locales de credenciales.

## Documentación

- [INTEGRATION-AUDIT.md](INTEGRATION-AUDIT.md): funciones conectadas, pruebas y límites del backend.
- [LOCAL-DEVELOPMENT.md](LOCAL-DEVELOPMENT.md): configuración del entorno original y comandos de desarrollo.

Mantenimiento y asientos están conectados a los módulos incorporados en `develop`. Pagos y sincronización externa requieren proveedores reales y no generan resultados simulados. Los diagnósticos de equipos corresponden al modelo del backend, no a una comprobación de hardware físico.

## Comprobaciones

```sh
npm run build
node scripts/check-local-integration.mjs
```

Los scripts de pruebas de escritura necesitan una base aislada y los servidores de verificación indicados en `INTEGRATION-AUDIT.md`; no deben ejecutarse contra datos reales.
