-- ============================================================
-- Migración DuMont (idempotente: se puede correr varias veces)
-- ============================================================
-- Qué hace:
--   1) Agrega las columnas que el código espera y que pueden faltar en una
--      base existente (sequelize.sync() NO altera tablas ya creadas).
--   2) Crea las tablas de Multimedia si no existen.
--
-- Funciona en MySQL 5.7 (no usa ADD COLUMN IF NOT EXISTS, que es de 8+):
-- usa un procedimiento temporal que consulta information_schema.
--
-- Cómo correrlo: pegar todo en phpMyAdmin / cliente SQL de la base de Render
-- (o: mysql -h HOST -u USER -p NOMBRE_BD < migracion_dumont.sql)
-- ============================================================

DROP PROCEDURE IF EXISTS dumont_add_column;

DELIMITER $$
CREATE PROCEDURE dumont_add_column(
  IN p_table VARCHAR(64),
  IN p_column VARCHAR(64),
  IN p_definition VARCHAR(255)
)
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = p_table
      AND COLUMN_NAME = p_column
  ) THEN
    SET @ddl = CONCAT('ALTER TABLE `', p_table, '` ADD COLUMN `', p_column, '` ', p_definition);
    PREPARE stmt FROM @ddl;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
  END IF;
END$$
DELIMITER ;

-- ---------- Clientes ----------
CALL dumont_add_column('Clientes', 'CondicionFiscal', 'VARCHAR(50) NULL');
CALL dumont_add_column('Clientes', 'Latitud',  'VARCHAR(45) NULL');
CALL dumont_add_column('Clientes', 'Longitud', 'VARCHAR(45) NULL');

-- ---------- Dispositivos ----------
CALL dumont_add_column('Dispositivos', 'latitud',  'VARCHAR(45) NULL');
CALL dumont_add_column('Dispositivos', 'longitud', 'VARCHAR(45) NULL');
CALL dumont_add_column('Dispositivos', 'UltimaConexion', 'DATETIME NULL');
CALL dumont_add_column('Dispositivos', 'HorarioPublicitario', 'VARCHAR(100) NULL');

-- Link de pantalla de un solo dispositivo
CALL dumont_add_column('Dispositivos', 'SesionToken', 'VARCHAR(64) NULL');
CALL dumont_add_column('Dispositivos', 'SesionUltimoLatido', 'DATETIME NULL');

-- Verificación en 2 pasos (TOTP)
CALL dumont_add_column('Usuarios', 'TwoFactorSecret', 'TEXT NULL');
CALL dumont_add_column('Usuarios', 'TwoFactorEnabled', 'TINYINT(1) NOT NULL DEFAULT 0');
CALL dumont_add_column('Usuarios', 'TwoFactorRecovery', 'TEXT NULL');
CALL dumont_add_column('Usuarios', 'TwoFactorLastStep', 'INT NULL');

-- Teléfono de clientes: de INT a texto (los números largos desbordaban el INT
-- y se perdían los ceros iniciales). Seguro de correr más de una vez.
ALTER TABLE Clientes MODIFY Telefono VARCHAR(20) NOT NULL;

DROP PROCEDURE IF EXISTS dumont_add_column;

-- ---------- Multimedia ----------
CREATE TABLE IF NOT EXISTS `Multimedia` (
  `idMultimedia` CHAR(36) NOT NULL,
  `url` VARCHAR(500) NOT NULL,
  `tipo` ENUM('imagen','video') NOT NULL,
  `nombreArchivo` VARCHAR(255) NULL,
  `duracionSegundos` INT NOT NULL DEFAULT 8,
  `createdAt` DATETIME NOT NULL,
  PRIMARY KEY (`idMultimedia`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `MultimediaAsignacion` (
  `idAsignacion` CHAR(36) NOT NULL,
  `MultimediaId` CHAR(36) NOT NULL,
  `CodigoDumont` VARCHAR(45) NULL,
  `CodigoDistribuidor` VARCHAR(45) NULL,
  `Segmentacion` ENUM('Kiosco','Almacen','Autoservicio') NULL,
  `orden` INT NOT NULL DEFAULT 0,
  `createdAt` DATETIME NOT NULL,
  PRIMARY KEY (`idAsignacion`),
  KEY `MultimediaId` (`MultimediaId`),
  CONSTRAINT `multimediaasignacion_ibfk_1` FOREIGN KEY (`MultimediaId`)
    REFERENCES `Multimedia` (`idMultimedia`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------- Verificación (opcional) ----------
-- Debe listar las columnas nuevas de Dispositivos:
-- SHOW COLUMNS FROM Dispositivos;
