# Ejecución local

Requisito: MySQL debe estar activo en `localhost:3306`, con la conexión configurada en `KinemoPlatform.API/appsettings.json` o mediante `ConnectionStrings__DefaultConnection`. No se cambiaron credenciales ni se sustituyó la base por datos simulados. El backend ejecuta `EnsureCreated` durante el arranque.

MySQL Server 8.4.13 quedó instalado de forma local en `kinemo-platform/.local/mysql` y la base `kinemo-platform-wa` fue creada por el backend. Los datos y la contraseña local están ignorados por Git. En Workbench conecta con `127.0.0.1`, puerto `3306`, usuario `root` y tu contraseña. MySQL está ejecutándose como proceso local, no como servicio de Windows.

Después de reiniciar Windows, arranca MySQL antes del backend:

```powershell
Set-Location C:\Users\Usuario\RiderProjects\kinemo-platform
.\Start-LocalDatabase.ps1
```

El backend carga `appsettings.Development.local.json` solo en Development; las variables de entorno pueden sobrescribir esa configuración.

En PowerShell, inicia el backend:

```powershell
Set-Location C:\Users\Usuario\RiderProjects\kinemo-platform
dotnet run --project KinemoPlatform.API --launch-profile http
```

En otra terminal, inicia el frontend:

```powershell
Set-Location C:\Users\Usuario\WebstormProjects\kinemo-cinema-frontend2
npm run dev
```

Abre http://localhost:5173. Vite envía `/api/*` a `http://localhost:5089`, conservando `/api/v1`. Usa el perfil HTTP para la ejecución local. Swagger: http://localhost:5089/swagger.

No ejecutes `mock:api` para probar el backend real. Development y producción usan `/api/v1`; estas instrucciones usan el proxy de Vite en development. `vite preview` no proporciona este proxy de desarrollo.

## Comprobaciones

```powershell
node scripts/check-local-integration.mjs
npm run build -- --mode development
Invoke-RestMethod http://localhost:5173/api/v1/movies
Invoke-RestMethod http://localhost:5173/api/v1/rooms
Invoke-RestMethod http://localhost:5173/api/v1/shows
```

Las pruebas de contratos comprueban rutas, métodos, serialización y lectura de colecciones anidadas sin escribir datos. No sustituyen las últimas tres consultas contra MySQL real.

## Estado verificado

Consulta `INTEGRATION-AUDIT.md` para el alcance completo y las pruebas realizadas. Las pantallas activas consultan la API real. Mantenimiento y asientos no están implementados en el backend; pagos y sincronización externa requieren proveedores reales.

La configuración de la prueba opcional usa `KINEMO_BACKEND_URL` y una caché Vite separada. No cambies esa variable para ejecutar normalmente la aplicación: el destino por defecto es 5089.

Las pruebas de escritura se ejecutaron en una base separada, sin modificar los registros reales. El servidor MySQL, el backend en 5089 y el frontend en 5173 quedaron activos.
