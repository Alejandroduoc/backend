import multer from 'multer';
import path from 'path';
import fs from 'fs'; // Importar el módulo fs

const uploadsDir = path.join(__dirname, '../../uploads'); // Carpeta donde se guardarán las imágenes

// Asegurarse de que el directorio de subidas exista
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true }); // recursive: true crea directorios padres si es necesario
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // Usar el directorio definido y asegurado
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Nombre único para cada archivo
  },
});

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      // Es mejor pasar un objeto Error para que Multer lo maneje.
      // Esto puede ser capturado en tu manejador de errores de ruta si es necesario.
      cb(new Error('Solo se permiten imágenes (jpeg, jpg, png)'));
    }
  },
});