# appAdministrativa

## Descripción
appAdministrativa es una aplicación web para la gestión de documentos tributarios y administración de usuarios con autenticación basada en JWT. Permite la carga de archivos Excel y la descarga de certificados en PDF (ICA, IVA y RTE), con control de acceso por roles (administrador/empleado). También facilita la gestión de empresas y empleados dentro del sistema.

La aplicación está compuesta por un backend en Node.js con Express y Sequelize, y un frontend en React con Tailwind CSS.

## Características principales
- **Autenticación con JWT**: Inicio de sesión como administrador o empleado utilizando un código de usuario y contraseña.
- **Gestión de usuarios**: El administrador puede cambiar la contraseña de cualquier usuario.
- **Gestión de empresas**: Creación de empresas con su respectivo logo.
- **Carga de documentos**: Subida de documentos tributarios en formato Excel (ICA, IVA y RTE), organizados por año y periodo.
- **Generación automática de usuarios**: Se crean usuarios con base en el NIT del documento cargado.
- **Descarga de certificados**: Generación y descarga de certificados en PDF según criterios de búsqueda (tipo de documento, periodo, año y NIT).
- **Panel de usuario**: Vista diferenciada para administrador y empleado, mostrando el logo de la empresa y el NIT.
- **Control de sesiones**: Las sesiones expiran automáticamente después de una hora.

## Tecnologías utilizadas
### Backend
- Node.js
- Express.js
- MySQL con Sequelize ORM
- JWT para autenticación
- Multer para carga de archivos
- PDFKit para generación de PDFs
- Zod para validación de datos

### Frontend
- React
- TypeScript
- Tailwind CSS
- Axios para llamadas al backend
- React Hook Form para manejo de formularios
- React Router DOM para navegación

## Instalación y configuración
### Requisitos previos
- Node.js y npm
- MySQL

### Instalación del Backend
1. Clonar el repositorio:
   ```sh
   git clone git clone https://github.com/Stiwarg/appAdministrativa.git
   cd appAdministrativa/backend
   ```
2. Instalar dependencias:
   ```sh
   npm install
   ```
3. Configurar variables de entorno:
   - Crear un archivo `.env` en `/backend` con las siguientes variables:
    ```env
    NODE_ENV=development
    PORT=3309
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=
    DB_NAME=administrationsdb
    DB_PORT=3306
    SECRET_JWT_KEY=mySuperSecretKey
    JWT_EXPIRES_IN=1h
    JWT_REFRESH_EXPIRES_IN=7d
    FRONTEND_URL=http://localhost:5173
    BACKEND_URL=http://localhost:3309
    ```

4. Ejecutar migraciones y seeders:
   ```sh
   npx sequelize db:migrate
   npx sequelize db:seed:all
   ```
5. Iniciar el servidor:
   ```sh
   npm run dev
   ```

### Instalación del Frontend
1. Ir al directorio del frontend:
   ```sh
   cd ../frontend
   ```
2. Instalar dependencias:
   ```sh
   npm install
   ```
3. Configurar variables de entorno:
   - Crear un archivo `.env` en `/frontend` con:
    ```env
    VITE_API_URL=http://localhost:3309/api
    VITE_ENV=development     
    ```
4. Iniciar la aplicación:
   ```sh
   npm run dev
   ```

## Estructura del Proyecto
### Backend (`/backend`)
```
/backend
  /seeders            # Seeder para la base de datos.
  /src
    /config           # Configuración de la base de datos, variables de entorno, etc.
    /controllers      # Controladores con la lógica de negocio.
    /models           # Modelos de la base de datos.
    /routes           # Rutas del API REST.
    /services         # Servicios con lógica reutilizable.
    /middlewares      # Middlewares de validación y autenticación.
    /utils            # Utilidades y helpers.
    /interfaces       # Definiciones de tipos/interfaces de TypeScript.
    /schemas          # Esquemas de validación con Zod.
    /uploads
      /excels        # Carpeta para almacenar archivos Excel subidos.
      /logos         # Carpeta para almacenar logos de empresas.
    app.ts            # Configuración principal de Express.
  /dist               # Código transpilado.
  tsconfig.json       # Configuración de TypeScript.
  .env                # Variables de entorno.
  package.json        # Dependencias del backend.
```

### Frontend (`/frontend`)
```
/frontend
  /src
    /components       # Componentes reutilizables.
    /pages            # Páginas principales.
    /services         # Llamadas al backend con Axios.
    /context          # Manejo de estados globales.
    /hooks            # Custom hooks.
    /styles           # Estilos globales con Tailwind CSS.
    /types            # Tipos/interfaces de TypeScript.
    App.tsx           # Punto de entrada principal.
    index.tsx         # Renderizado de React.
  .env                # Variables de entorno.
  tsconfig.json       # Configuración de TypeScript.
  package.json        # Dependencias del frontend.
```


1. **Autenticación**:
   - Se inicia sesión con un código de empleado o administrador y una contraseña de 8 dígitos.
   - Las sesiones tienen una duración de 1 hora.
   - El administrador puede cambiar la contraseña de cualquier usuario.
   - Los empleados solo pueden cambiar su propia contraseña.

2. **Gestión de Empresas** (Solo Administrador):
   - Crear empresas proporcionando un nombre y subiendo un logo en formato PNG, JPG o JPEG.

3. **Carga de Documentos** (Solo Administrador):
   - Subir documentos de ICA, IVA (bimestrales) y RTE (mensuales).
   - Se puede elegir el año del documento (actual, 2023, 2024, 2025).
   - Se debe seleccionar la empresa a la que pertenece el documento.
   - Se sube un archivo Excel con una tabla en la primera hoja con los siguientes encabezados:
     - TP.rete, NIT, DV, Razón social, Nombre concepto en certificado, Base, Valor retenido, %.
   - Al subir documentos, se crean automáticamente usuarios con el NIT encontrado en el archivo Excel.

4. **Descarga de Certificados**:
   - Seleccionar tipo de documento (IVA, ICA, RTE).
   - Seleccionar período (mensual para RTE, bimestral para IVA/ICA) o todos los periodos disponibles.
   - Ingresar el NIT a buscar (para administradores, el empleado lo tiene prellenado desde cookies).
   - Seleccionar el año del certificado.
   - Si el certificado existe, se puede descargar en formato PDF.

5. **Panel de Usuario**:
   - Al iniciar sesión, se muestra el panel con el logo de la empresa y el NIT asociado.
   - Un empleado no tiene acceso a la sección de gestión de empresas ni a la sección de subida de documentos.
   - Un empleado solo puede descargar sus propios certificados.

6. **Cierre de Sesión**:
   - Tanto administradores como empleados pueden cerrar sesión.


## Contacto
Si tienes dudas o sugerencias, contáctame:
- 📧 Email: stiwarg798@gmail.com
- 🐙 GitHub: [Stiwarg](https://github.com/Stiwarg)
- 🔗 LinkedIn: [Jhon Estiven Gonzalez Marin](https://www.linkedin.com/in/jhon-estiven-gonzalez-marin-70b9a1282)


