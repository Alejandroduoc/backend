# Backend API - Ferremas

API RESTful para gestión de productos, sucursales y subida de imágenes, desarrollada en Node.js, Express y TypeScript.

---

## 🚀 Características

- CRUD de productos
- Subida de imágenes con Multer
- Documentación interactiva con Swagger (OpenAPI)
- Conexión a MySQL
- Listo para desarrollo local o despliegue con Docker

---

## 📦 Instalación local

1. **Clona el repositorio:**
   ```sh
   git clone https://github.com/tuusuario/ferremas-backend.git
   cd ferremas-backend
   ```

2. **Instala dependencias:**
   ```sh
   npm install
   ```

3. **Configura el archivo `.env`:**
   Copia el ejemplo y edítalo según tus credenciales:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=ferremas
   DB_PASSWORD=tu_contraseña
   DB_NAME=ferremas

   MYSQL_ROOT_PASSWORD=tu_contraseña_root
   MYSQL_DATABASE_NAME=ferremas
   MYSQL_APP_USER=ferremas
   MYSQL_APP_PASSWORD=tu_contraseña
   ```

4. **Compila el proyecto:**
   ```sh
   npm run build
   ```

5. **Inicia el servidor:**
   ```sh
   npm start
   ```

---

## 🐳 Uso con Docker

1. **Asegúrate de tener Docker y Docker Compose instalados.**

2. **Levanta los servicios:**
   ```sh
   docker-compose up --build
   ```

3. **La API estará disponible en:**  
   [http://localhost:3000](http://localhost:3000)

---

## 📚 Documentación Swagger

Accede a la documentación interactiva en:  
[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## 🗂️ Estructura del proyecto

```
src/
  controllers/
  middleware/
  routes/
  app.ts
  server.ts
public/
uploads/
Dockerfile
docker-compose.yml
.env
```

---

## ✍️ Endpoints principales

- `GET /api/productos` — Lista todos los productos
- `POST /api/products` — Crea o actualiza un producto (permite subir imagen)
- `GET /api-docs` — Documentación Swagger

---

## 🛠️ Scripts útiles

- `npm run dev` — Desarrollo con recarga automática
- `npm run build` — Compila TypeScript a JavaScript
- `npm start` — Inicia el servidor en producción

---

## 📝 Notas

- Recuerda configurar correctamente tu archivo `.env`.
- Si usas Docker, los datos de MySQL se almacenan en un volumen persistente.
- Para inicializar la base de datos puedes usar el archivo `init.sql`.

---

## 📄 Licencia

MIT

---

**¡Listo! Modifica los campos según tus necesidades.**