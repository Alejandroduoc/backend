import express from 'express';
import cors from 'cors';
import productRoutes from './routes/product.routes';
import path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';


const app = express();

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Productos',
      version: '1.0.0',
      description: 'Documentación de la API para productos',
    },
  },
  apis: ['./src/routes/*.ts'], // Ajusta la ruta si es necesario
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Habilita CORS para todos los orígenes (útil en desarrollo)
app.use(cors());

// Permite recibir JSON
app.use(express.json());

// Servir imágenes estáticas
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../public')));

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas de productos
app.use('/api', productRoutes);

// Ruta raíz para verificar si el backend está activo
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html')); // Servir el formulario como página principal
});

<<<<<<< Updated upstream


export default app;
=======
export default app;
>>>>>>> Stashed changes
