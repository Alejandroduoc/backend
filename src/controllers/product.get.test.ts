import { Request, Response } from 'express';
import { getProducts } from './product.controller';
import { pool } from '../services/db';

// Mockear el módulo 'db'
jest.mock('../services/db', () => ({
  pool: {
    query: jest.fn(),
  },
}));

describe('Product Controller - getProducts only', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject: any;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    // Resetear mocks antes de cada prueba
    (pool.query as jest.Mock).mockReset();
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
        return mockResponse as Response;
      }),
      status: jest.fn().mockImplementation(() => mockResponse as Response),
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
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should return an empty array when no products are found', async () => {
      const mockProducts: any[] = [];
      (pool.query as jest.Mock).mockResolvedValue([mockProducts]);

      await getProducts(mockRequest as Request, mockResponse as Response);

      expect(pool.query).toHaveBeenCalledWith('SELECT codigo, nombre, descripcion, precio, imagen,codigo_sucursal FROM productos');
      expect(mockResponse.json).toHaveBeenCalledWith([]);
      expect(mockResponse.status).not.toHaveBeenCalled();
    });
  });
});