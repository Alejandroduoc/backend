import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Subida de Imágenes',
      version: '1.0.0',
      description: 'Documentación de la API para subir imágenes usando Multer',
    },
  },
  apis: ['./src/routes/*.ts'], // Ajusta la ruta según donde estén tus rutas
};

export const swaggerSpec = swaggerJSDoc(options);
export { swaggerUi };