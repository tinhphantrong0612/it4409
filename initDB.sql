-- -----------------------------------------------------
CREATE DATABASE `it4409`;

USE `it4409`;

CREATE TABLE `it4409`.`storage` (
  `Id` VARCHAR(36) NOT NULL,
  `DisplayName` VARCHAR(50) NOT NULL,
  `Address` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`Id`)
);

-- -----------------------------------------------------
-- Table `it4409`.`unit`
-- -----------------------------------------------------
CREATE TABLE `it4409`.`unit` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `DisplayName` VARCHAR(10) NOT NULL,
  `StorageId` VARCHAR(36) NOT NULL,
  PRIMARY KEY (`Id`),
  FOREIGN KEY (`StorageId`) REFERENCES `it4409`.`storage` (`Id`)
);

-- -----------------------------------------------------
-- Table `it4409`.`object`
-- -----------------------------------------------------
CREATE TABLE `it4409`.`object` (
  `Id` VARCHAR(36) NOT NULL,
  `DisplayName` VARCHAR(200) NOT NULL,
  `UnitId` INT NOT NULL,
  `StorageId` VARCHAR(36) NOT NULL,
  PRIMARY KEY (`Id`),
  FOREIGN KEY (`StorageId`) REFERENCES `it4409`.`storage` (`Id`),
  FOREIGN KEY (`UnitId`) REFERENCES `it4409`.`unit` (`Id`)
);

-- -----------------------------------------------------
-- Table `it4409`.`customer`
-- -----------------------------------------------------
CREATE TABLE `it4409`.`customer` (
  `Id` VARCHAR(36) NOT NULL,
  `DisplayName` VARCHAR(50) NOT NULL,
  `Address` VARCHAR(200) NOT NULL,
  `Phone` VARCHAR(20) NOT NULL,
  `Email` VARCHAR(50) NOT NULL,
  `MoreInfo` varchar(200) NULL DEFAULT NULL,
  `StorageId` VARCHAR(36) NOT NULL,
  PRIMARY KEY (`Id`),
  FOREIGN KEY (`StorageId`) REFERENCES `it4409`.`storage` (`Id`)
);

-- -----------------------------------------------------
-- Table `it4409`.`export`
-- -----------------------------------------------------
CREATE TABLE `it4409`.`export` (
  `Id` VARCHAR(36) NOT NULL,
  `ExportDate` DATE NOT NULL,
  `CustomerId` varchar(36) NOT NULL,
  `StorageId` VARCHAR(36) NOT NULL,
  PRIMARY KEY (`Id`),
  FOREIGN KEY (`StorageId`) REFERENCES `it4409`.`storage` (`Id`),
  FOREIGN KEY (`CustomerId`) REFERENCES `it4409`.`customer` (`Id`)
);

-- -----------------------------------------------------
-- Table `it4409`.`exportinfo`
-- -----------------------------------------------------
CREATE TABLE `it4409`.`exportinfo` (
  `Id` VARCHAR(36) NOT NULL,
  `ObjectId` VARCHAR(36) NOT NULL,
  `ExportId` VARCHAR(36) NOT NULL,
  `Amount` INT NOT NULL,
  `ExportPrice` int NOT NULL,
  `StorageId` VARCHAR(36) NOT NULL,
  PRIMARY KEY (`Id`),
  FOREIGN KEY (`StorageId`) REFERENCES `it4409`.`storage` (`Id`),
  FOREIGN KEY (`ObjectId`) REFERENCES `it4409`.`object` (`Id`),
  FOREIGN KEY (`ExportId`) REFERENCES `it4409`.`export` (`Id`)
);

-- -----------------------------------------------------
-- Table `it4409`.`supplier`
-- -----------------------------------------------------
CREATE TABLE `it4409`.`supplier` (
  `Id` varchar(36) NOT NULL,
  `DisplayName` VARCHAR(50) NOT NULL,
  `Address` VARCHAR(200) NOT NULL,
  `Phone` VARCHAR(20) NOT NULL,
  `Email` VARCHAR(30) NOT NULL,
  `MoreInfo` VARCHAR(200) NULL DEFAULT NULL,
  `StorageId` VARCHAR(36) NOT NULL,
  PRIMARY KEY (`Id`),
  FOREIGN KEY (`StorageId`) REFERENCES `it4409`.`storage` (`Id`)
);

-- -----------------------------------------------------
-- Table `it4409`.`import`
-- -----------------------------------------------------
CREATE TABLE `it4409`.`import` (
  `Id` VARCHAR(36) NOT NULL,
  `ImportDate` DATE NOT NULL,
  `SupplierId` varchar(36) NOT NULL,
  `StorageId` VARCHAR(36) NOT NULL,
  PRIMARY KEY (`Id`),
  FOREIGN KEY (`StorageId`) REFERENCES `it4409`.`storage` (`Id`),
  FOREIGN KEY (`SupplierId`) REFERENCES `it4409`.`supplier` (`Id`)
);

-- -----------------------------------------------------
-- Table `it4409`.`importinfo`
-- -----------------------------------------------------
CREATE TABLE `it4409`.`importinfo` (
  `Id` VARCHAR(36) NOT NULL,
  `ObjectId` VARCHAR(36) NOT NULL,
  `ImportId` VARCHAR(36) NOT NULL,
  `Amount` INT NOT NULL,
  `ImportPrice` FLOAT NOT NULL,
  `Barcode` VARCHAR(50) NOT NULL,
  `StorageId` VARCHAR(36) NOT NULL,
  PRIMARY KEY (`Id`),
  FOREIGN KEY (`StorageId`) REFERENCES `it4409`.`storage` (`Id`),
  FOREIGN KEY (`ObjectId`) REFERENCES `it4409`.`object` (`Id`),
  FOREIGN KEY (`ImportId`) REFERENCES `it4409`.`import` (`Id`)
);

-- -----------------------------------------------------
-- Table `it4409`.`user`
-- -----------------------------------------------------
CREATE TABLE `it4409`.`user` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `DisplayName` VARCHAR(50) NOT NULL,
  `Username` VARCHAR(50) NOT NULL,
  `Password` VARCHAR(200) NOT NULL,
  `Role` INT NOT NULL,
  PRIMARY KEY (`Id`)
);

CREATE TABLE `it4409`.`storageuser` (
  `Id` VARCHAR(36) NOT NULL,
  `UserId` INT NOT NULL,
  `StorageId` VARCHAR(36) NOT NULL,
  PRIMARY KEY (`Id`),
  FOREIGN KEY (`StorageId`) REFERENCES `it4409`.`storage` (`Id`),
  FOREIGN KEY (`UserId`) REFERENCES `it4409`.`user` (`Id`)
);

INSERT INTO `it4409`.`user` (`DisplayName`, `Username`, `Password`, `Role`) VALUES ('Phan Trọng Tình', 'tinh', '1', 0);
INSERT INTO `it4409`.`user` (`DisplayName`, `Username`, `Password`, `Role`) VALUES ('Bùi Hoàng Long', 'long', '1', 0);
INSERT INTO `it4409`.`user` (`DisplayName`, `Username`, `Password`, `Role`) VALUES ('Lưu Hồng Đức', 'duc', '1', 0);
