CREATE DATABASE IF NOT EXISTS FERREMAS;
USE FERREMAS;

CREATE TABLE IF NOT EXISTS productos (
  id INT(11) NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT DEFAULT NULL,
  precio DECIMAL(10,2) NOT NULL,
  stock INT(11) NOT NULL DEFAULT 0,
  creado_en TIMESTAMP NOT NULL DEFAULT current_timestamp(),
  imagen VARCHAR(255) DEFAULT NULL,
  codigo VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo_producto VARCHAR(50) NOT NULL,
    cantidad INT NOT NULL,
    precio_venta DECIMAL(10, 2) NOT NULL,
    fecha_venta DATE NOT NULL,
    fecha_actual TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (codigo_producto) REFERENCES productos(codigo) -- Asumiendo que productos.codigo será UNIQUE y NOT NULL para ser FK
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS sucursal (
  id INT(11) NOT NULL AUTO_INCREMENT,
  codigo_sucursal VARCHAR(50) NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL,
  direccion TEXT DEFAULT NULL,
  telefono VARCHAR(20) DEFAULT NULL,
  creado_en TIMESTAMP NOT NULL DEFAULT current_timestamp(),
  actualizado_en TIMESTAMP NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;