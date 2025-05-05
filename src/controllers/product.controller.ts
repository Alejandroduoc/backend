import { Request, Response } from 'express';
import { pool } from '../services/db';
import path from 'path';

export const getProducts = async (req: Request, res: Response) => {
  try {
    // Realizar la consulta a la base de datos
    const [rows]: any[] = await pool.query('SELECT codigo, nombre, descripcion, precio, imagen FROM productos');

    // Convertir rutas locales de imágenes a URLs públicas
    const products = rows.map((product: any) => ({
      ...product,
      imagen: product.imagen
        ? `${req.protocol}://${req.get('host')}/uploads/${path.basename(product.imagen)}`
        : null,
    }));

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

export const createOrUpdateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { codigo,nombre, descripcion, precio, stock } = req.body;
    const imagePath = req.file?.path; // Ruta de la imagen subida

    if (!codigo || !descripcion || !precio) {
      res.status(400).json({ error: 'Código, descripción y precio son obligatorios' });
      return; // End execution after sending the response
    }

    // Verificar si el producto ya existe
    const [existingProduct] = await pool.query<any[]>('SELECT * FROM productos WHERE codigo = ?', [codigo]);

    if (existingProduct && existingProduct.length > 0) {
      // Si existe, actualizar el stock
      await pool.query('UPDATE productos SET stock = stock + ? WHERE codigo = ?', [stock || 0, codigo]);
      res.status(200).json({ message: 'Stock actualizado correctamente' });
      return; // End execution after sending the response
    }

    // Si no existe, crear un nuevo producto
    const query = 'INSERT INTO productos (codigo,nombre ,descripcion, precio, imagen, stock) VALUES (?, ?, ?, ?, ?,?)';
    await pool.query(query, [codigo,nombre, descripcion, precio, imagePath, stock || 0]);

    res.status(201).json({ message: 'Producto creado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
};
