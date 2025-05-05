import { Router } from 'express';
import { getProducts } from '../controllers/product.controller';
import { createOrUpdateProduct } from '../controllers/product.controller';
import { upload } from '../middleware/upload';



const router = Router();

router.get('/productos', getProducts);
router.post('/products', upload.single('image'), createOrUpdateProduct);
export default router;
