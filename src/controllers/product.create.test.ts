import { Request, Response } from 'express';
import { createOrUpdateProduct } from './product.controller';
import { pool } from '../services/db';

// Mockear el módulo 'db'
jest.mock('../services/db', () => ({
  pool: {
    query: jest.fn(),
  },
}));

describe('Product Controller - createProduct only', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    // Resetear mocks antes de cada prueba
    (pool.query as jest.Mock).mockReset();
    // Silenciar console.error y espiar sus llamadas
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    mockRequest = {
      body: {
        codigo: 'P003',
        nombre: 'Keyboard',
        descripcion: 'Mechanical Keyboard',
        precio: 75,
        stock: 10,
        id_sucursal: 'S02',
      },
      file: {
        path: '/uploads/keyboard.jpg',
        fieldname: 'image',
        originalname: 'keyboard.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        destination: '/uploads',
        filename: 'keyboard.jpg',
        size: 1024
      } as Express.Multer.File,
    };
    
    mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    // Restaurar console.error a su implementación original después de cada prueba
    consoleErrorSpy.mockRestore();
  });

  it('should create a new product if it does not exist', async () => {
    (pool.query as jest.Mock)
      .mockResolvedValueOnce([[]]) // Simula que el producto no existe
      .mockResolvedValueOnce(undefined); // Simula que la inserción fue exitosa

    await createOrUpdateProduct(mockRequest as Request, mockResponse as Response);

    expect(pool.query).toHaveBeenNthCalledWith(1, 'SELECT * FROM productos WHERE codigo = ?', ['P003']);
    expect(pool.query).toHaveBeenNthCalledWith(2,
      'INSERT INTO productos (codigo, nombre, descripcion, precio, imagen, stock, codigo_sucursal) VALUES (?, ?, ?, ?, ?, ?, ?)',
      ['P003', 'Keyboard', 'Mechanical Keyboard', 75, '/uploads/keyboard.jpg', 10, 'S02']
    );
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Producto creado con éxito' });
  });

  it('should use stock 0 if not provided when creating a new product', async () => {
    (pool.query as jest.Mock)
      .mockResolvedValueOnce([[]]) // Simula que el producto no existe
      .mockResolvedValueOnce(undefined); // Simula que la inserción fue exitosa
    
    delete mockRequest.body.stock; // Eliminar stock del body

    await createOrUpdateProduct(mockRequest as Request, mockResponse as Response);

    expect(pool.query).toHaveBeenNthCalledWith(2,
      'INSERT INTO productos (codigo, nombre, descripcion, precio, imagen, stock, codigo_sucursal) VALUES (?, ?, ?, ?, ?, ?, ?)',
      ['P003', 'Keyboard', 'Mechanical Keyboard', 75, '/uploads/keyboard.jpg', 0, 'S02']
    );
    expect(mockResponse.status).toHaveBeenCalledWith(201);
  });

  it('should return 400 if required fields are missing', async () => {
    mockRequest.body = { nombre: 'Test' }; // Faltan campos obligatorios

    await createOrUpdateProduct(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Código, nombre, descripción, precio e ID de sucursal son obligatorios' });
    expect(pool.query).not.toHaveBeenCalled();
  });

  it('should handle errors during product creation', async () => {
    (pool.query as jest.Mock).mockRejectedValue(new Error('DB Error'));

    await createOrUpdateProduct(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Error al procesar la solicitud' });
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});