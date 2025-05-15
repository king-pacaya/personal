# Instrucciones para crear la base de datos y tablas

La base de datos debe llamarse **cronograma** y las tablas deben seguir esta estructura para evitar problemas.

```sql
CREATE DATABASE IF NOT EXISTS cronograma;
USE cronograma;

CREATE TABLE IF NOT EXISTS dias_cronograma (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE NOT NULL,
    dia_semana VARCHAR(10) NOT NULL,
    estado ENUM('pendiente', 'pagado', 'no_aplica') DEFAULT 'pendiente',
    comentario VARCHAR(255),
    UNIQUE KEY (fecha)
);

CREATE TABLE IF NOT EXISTS configuracion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha_inicio DATE NOT NULL,
    total_dias INT NOT NULL,
    excluir_domingo BOOLEAN DEFAULT TRUE
);
