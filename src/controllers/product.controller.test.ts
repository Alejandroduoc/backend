import { Request, Response } from 'express';
import { getProducts, createOrUpdateProduct } from './product.controller';
import { pool } from '../services/db';
import path from 'path';

// Mockear el módulo 'db'
jest.mock('../services/db', () => ({
  pool: {
    query: jest.fn(),
  },
}));

// Mockear path.basename para controlar su salida en las pruebas
jest.mock('path', () => ({
  ...jest.requireActual('path'), // Importar y conservar las implementaciones originales
  basename: jest.fn((p) => p.split('/').pop() || ''),
}));


describe('Product Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject: any;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    // Resetear mocks antes de cada prueba
    (pool.query as jest.Mock).mockReset();
    (path.basename as jest.Mock).mockImplementation((p) => p.split('/').pop() || '');
    // Silenciar console.error y espiar sus llamadas
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});


    mockRequest = {
      protocol: 'http',
      get: jest.fn().mockReturnValue('localhost:3000'),
      body: {},
      file: undefined,
    };
    responseObject = {};
    mockResponse = {
      json: jest.fn().mockImplementation(result => {
        responseObject = result;
        return mockResponse as Response; // Devolver el mockResponse para encadenar
      }),
      status: jest.fn().mockImplementation(() => mockResponse as Response), // Devolver el mockResponse para encadenar
    };
  });

  afterEach(() => {
    // Restaurar console.error a su implementación original después de cada prueba
    consoleErrorSpy.mockRestore();
  });

  describe('getProducts', () => {
    it('should return products with public image URLs', async () => {
      const mockProducts = [
        { codigo: 'P001', nombre: 'Laptop', descripcion: 'Gaming Laptop', precio: 1200, imagen: '/uploads/laptop.jpg', codigo_sucursal: 'S01' },
        { codigo: 'P002', nombre: 'Mouse', descripcion: 'Wireless Mouse', precio: 25, imagen: null, codigo_sucursal: 'S01' },
      ];
      (pool.query as jest.Mock).mockResolvedValue([mockProducts]);
      (path.basename as jest.Mock).mockImplementation((p) => p.substring(p.lastIndexOf('/') + 1));


      await getProducts(mockRequest as Request, mockResponse as Response);

      expect(pool.query).toHaveBeenCalledWith('SELECT codigo, nombre, descripcion, precio, imagen,codigo_sucursal FROM productos');
      expect(mockResponse.json).toHaveBeenCalledWith([
        { ...mockProducts[0], imagen: 'http://localhost:3000/uploads/laptop.jpg' },
        { ...mockProducts[1], imagen: null },
      ]);
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should handle errors when fetching products', async () => {
      (pool.query as jest.Mock).mockRejectedValue(new Error('DB Error'));

      await getProducts(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Error al obtener productos' });
      expect(consoleErrorSpy).toHaveBeenCalled(); // Opcional: verificar que se intentó loguear un error
    });
  });

  describe('createOrUpdateProduct', () => {
    beforeEach(() => {
        mockRequest.body = {
            codigo: 'P003',
            nombre: 'Keyboard',
            descripcion: 'Mechanical Keyboard',
            precio: 75,
            stock: 10,
            id_sucursal: 'S02',
        };
        mockRequest.file = {
            path: '/uploads/keyboard.jpg',
            fieldname: 'image',
            originalname: 'keyboard.jpg',
            encoding: '7bit',
            mimetype: 'image/jpeg',
            destination: '/uploads',
            filename: 'keyboard.jpg',
            size: 1024
        } as Express.Multer.File;
    });

    it('should create a new product if it does not exist', async () => {
      (pool.query as jest.Mock)
        .mockResolvedValueOnce([[]]) // No existing product
        .mockResolvedValueOnce(undefined); // Insert successful

      await createOrUpdateProduct(mockRequest as Request, mockResponse as Response);

      expect(pool.query).toHaveBeenNthCalledWith(1, 'SELECT * FROM productos WHERE codigo = ?', ['P003']);
      expect(pool.query).toHaveBeenNthCalledWith(2,
        'INSERT INTO productos (codigo, nombre, descripcion, precio, imagen, stock, codigo_sucursal) VALUES (?, ?, ?, ?, ?, ?, ?)',
        ['P003', 'Keyboard', 'Mechanical Keyboard', 75, '/uploads/keyboard.jpg', 10, 'S02']
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Producto creado con éxito' });
    });

    it('should update stock if product exists', async () => {
      const existingProduct = [{ codigo: 'P003', stock: 5 }];
      (pool.query as jest.Mock)
        .mockResolvedValueOnce([existingProduct]) // Product exists
        .mockResolvedValueOnce(undefined); // Update successful

      mockRequest.body.stock = 15; // New stock to add

      await createOrUpdateProduct(mockRequest as Request, mockResponse as Response);

      expect(pool.query).toHaveBeenNthCalledWith(1, 'SELECT * FROM productos WHERE codigo = ?', ['P003']);
      expect(pool.query).toHaveBeenNthCalledWith(2, 'UPDATE productos SET stock = stock + ? WHERE codigo = ?', [15, 'P003']);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Stock actualizado correctamente' });
    });

    it('should return 400 if required fields are missing', async () => {
      mockRequest.body = { nombre: 'Test' }; // Missing codigo, descripcion, precio, id_sucursal

      await createOrUpdateProduct(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Código, nombre, descripción, precio e ID de sucursal son obligatorios' });
      expect(pool.query).not.toHaveBeenCalled();
    });

    it('should handle errors during product creation/update', async () => {
      (pool.query as jest.Mock).mockRejectedValue(new Error('DB Error'));

      await createOrUpdateProduct(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Error al procesar la solicitud' });
      expect(consoleErrorSpy).toHaveBeenCalled(); // Opcional: verificar que se intentó loguear un error
    });

    it('should use stock 0 if not provided when creating a new product', async () => {
        (pool.query as jest.Mock)
        .mockResolvedValueOnce([[]]) // No existing product
        .mockResolvedValueOnce(undefined); // Insert successful
      
      delete mockRequest.body.stock; // Remove stock from body

      await createOrUpdateProduct(mockRequest as Request, mockResponse as Response);

      expect(pool.query).toHaveBeenNthCalledWith(2,
        'INSERT INTO productos (codigo, nombre, descripcion, precio, imagen, stock, codigo_sucursal) VALUES (?, ?, ?, ?, ?, ?, ?)',
        ['P003', 'Keyboard', 'Mechanical Keyboard', 75, '/uploads/keyboard.jpg', 0, 'S02']
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
    });

    it('should use stock 0 if not provided when updating an existing product', async () => {
        const existingProduct = [{ codigo: 'P003', stock: 5 }];
        (pool.query as jest.Mock)
          .mockResolvedValueOnce([existingProduct]) 
          .mockResolvedValueOnce(undefined); 
  
        delete mockRequest.body.stock;
        
        await createOrUpdateProduct(mockRequest as Request, mockResponse as Response);
  
        expect(pool.query).toHaveBeenNthCalledWith(2, 'UPDATE productos SET stock = stock + ? WHERE codigo = ?', [0, 'P003']);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
      });
  });
});
