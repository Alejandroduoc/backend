CREATE DATABASE IF NOT EXISTS FERREMAS;
USE FERREMAS;

-- Primero, crea la tabla 'sucursal' porque 'productos' la va a referenciar.
CREATE TABLE IF NOT EXISTS sucursal (
  id INT(11) NOT NULL AUTO_INCREMENT,
  codigo_sucursal VARCHAR(50) NOT NULL UNIQUE, -- Este es el campo que 'productos' referenciará
  nombre VARCHAR(100) NOT NULL,
  direccion TEXT DEFAULT NULL,
  telefono VARCHAR(20) DEFAULT NULL,
  creado_en TIMESTAMP NOT NULL DEFAULT current_timestamp(),
  actualizado_en TIMESTAMP NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Ahora, crea la tabla 'productos'
CREATE TABLE IF NOT EXISTS productos (
  id INT(11) NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT DEFAULT NULL,
  precio INT(11) NOT NULL,
  stock INT(11) NOT NULL DEFAULT 0,
  precio_compra INT DEFAULT NULL,
  imagen VARCHAR(255) DEFAULT NULL,
  codigo VARCHAR(255) NOT NULL UNIQUE, -- Código único del producto
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  codigo_sucursal VARCHAR(50) NOT NULL, -- Clave foránea que referencia a sucursal.codigo_sucursal
  PRIMARY KEY (id),
  FOREIGN KEY (codigo_sucursal) REFERENCES sucursal(codigo_sucursal)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `sucursal` (`id`, `codigo_sucursal`, `nombre`, `direccion`, `telefono`, `creado_en`, `actualizado_en`) VALUES (NULL, '1', 'santiago', NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);