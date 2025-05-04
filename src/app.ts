import express from 'express';
import cors from 'cors';
import productRoutes from './routes/product.routes';

const app = express();

// Habilita CORS para todos los orígenes (útil en desarrollo)
app.use(cors());

// Permite recibir JSON
app.use(express.json());

// Rutas de productos
app.use('/api', productRoutes);

// Ruta raíz para verificar si el backend está activo
app.get('/', (req, res) => {
  res.send('✅ API corriendo correctamente');
});

export default app;
