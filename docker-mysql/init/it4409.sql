SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

-- -----------------------------------------------------
-- Table `it4409`.`unit`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `unit`;
CREATE TABLE `unit` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `DisplayName` VARCHAR(10) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf32;

-- -----------------------------------------------------
-- Table `it4409`.`object`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `object`;
CREATE TABLE `object` (
  `Id` VARCHAR(36) NOT NULL,
  `DisplayName` VARCHAR(200) NOT NULL,
  `UnitId` INT NOT NULL,
  PRIMARY KEY (`Id`),
  FOREIGN KEY (`UnitId`) REFERENCES `it4409`.`unit` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf32;

-- -----------------------------------------------------
-- Table `it4409`.`customer`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `customer`;
CREATE TABLE `customer` (
  `Id` VARCHAR(36) NOT NULL,
  `DisplayName` VARCHAR(50) NOT NULL,
  `Address` VARCHAR(200) NOT NULL,
  `Phone` VARCHAR(20) NOT NULL,
  `Email` VARCHAR(50) NOT NULL,
  `MoreInfo` varchar(200) NULL DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf32;

-- -----------------------------------------------------
-- Table `it4409`.`export`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `export`;
CREATE TABLE `export` (
  `Id` VARCHAR(36) NOT NULL,
  `ExportDate` DATE NOT NULL,
  `CustomerId` varchar(36) NOT NULL,
  PRIMARY KEY (`Id`),
  FOREIGN KEY (`CustomerId`) REFERENCES `it4409`.`customer` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf32;

-- -----------------------------------------------------
-- Table `it4409`.`exportinfo`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `exportinfo`;
CREATE TABLE `exportinfo` (
  `Id` VARCHAR(36) NOT NULL,
  `ObjectId` VARCHAR(36) NOT NULL,
  `ExportId` VARCHAR(36) NOT NULL,
  `Amount` INT NOT NULL,
  `ExportPrice` int NOT NULL,
  PRIMARY KEY (`Id`),
  FOREIGN KEY (`ObjectId`) REFERENCES `it4409`.`object` (`Id`),
  FOREIGN KEY (`ExportId`) REFERENCES `it4409`.`export` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf32;

-- -----------------------------------------------------
-- Table `it4409`.`supplier`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `supplier`;
CREATE TABLE `supplier` (
  `Id` varchar(36) NOT NULL,
  `DisplayName` VARCHAR(50) NOT NULL,
  `Address` VARCHAR(200) NOT NULL,
  `Phone` VARCHAR(20) NOT NULL,
  `Email` VARCHAR(30) NOT NULL,
  `MoreInfo` VARCHAR(200) NULL DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf32;

-- -----------------------------------------------------
-- Table `it4409`.`import`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `import`;
CREATE TABLE `import` (
  `Id` VARCHAR(36) NOT NULL,
  `ImportDate` DATE NOT NULL,
  `SupplierId` varchar(36) NOT NULL,
  PRIMARY KEY (`Id`),
  FOREIGN KEY (`SupplierId`) REFERENCES `it4409`.`supplier` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf32; 

-- -----------------------------------------------------
-- Table `it4409`.`importinfo`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `importinfo`;
CREATE TABLE `importinfo` (
  `Id` VARCHAR(36) NOT NULL,
  `ObjectId` VARCHAR(36) NOT NULL,
  `ImportId` VARCHAR(36) NOT NULL,
  `Amount` INT NOT NULL,
  `ImportPrice` FLOAT NOT NULL,
  `Barcode` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`Id`),
  FOREIGN KEY (`ObjectId`) REFERENCES `it4409`.`object` (`Id`),
  FOREIGN KEY (`ImportId`) REFERENCES `it4409`.`import` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf32;

-- -----------------------------------------------------
-- Table `it4409`.`user`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `DisplayName` VARCHAR(50) NOT NULL,
  `Username` VARCHAR(50) NOT NULL,
  `Password` VARCHAR(200) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf32;

INSERT INTO `it4409`.`user` (`DisplayName`, `Username`, `Password`) VALUES ('Phan Trọng Tình', 'tinh', '1');
INSERT INTO `it4409`.`user` (`DisplayName`, `Username`, `Password`) VALUES ('Bùi Hoàng Long', 'long', '1');
INSERT INTO `it4409`.`user` (`DisplayName`, `Username`, `Password`) VALUES ('Lưu Hồng Đức', 'duc', '1');
