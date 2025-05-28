import { Router } from 'express';
import { getProducts } from '../controllers/product.controller';
import { createOrUpdateProduct } from '../controllers/product.controller';
import { upload } from '../middleware/upload';

const router = Router();

/**
 * @openapi
 * /productos:
 *   get:
 *     summary: Obtiene la lista de productos
 *     responses:
 *       200:
 *         description: Lista de productos obtenida correctamente
 */
router.get('/productos', getProducts);

/**
 * @openapi
 * /products:
 *   post:
 *     summary: Crea o actualiza un producto con imagen
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Imagen del producto (jpeg, jpg, png)
 *               // Aquí puedes agregar otros campos del producto si los tienes
 *     responses:
 *       200:
 *         description: Producto creado o actualizado correctamente
 *       400:
 *         description: Error en la subida o formato de archivo no permitido
 */
router.post('/products', upload.single('image'), createOrUpdateProduct);

export default router;