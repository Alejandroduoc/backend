import express from 'express';
import cors from 'cors';
import productRoutes from './routes/product.routes';
import path from 'path';

const app = express();

// Habilita CORS para todos los orígenes (útil en desarrollo)
app.use(cors());

// Permite recibir JSON
app.use(express.json());

// Servir imágenes estáticas
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../public')));

// Rutas de productos
app.use('/api', productRoutes);

// Ruta raíz para verificar si el backend está activo
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html')); // Servir el formulario como página principal
});

export default app;
