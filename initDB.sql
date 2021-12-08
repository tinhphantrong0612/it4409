-- -----------------------------------------------------
CREATE DATABASE `storagemanagement`;

USE `storagemanagement`;

-- -----------------------------------------------------
-- Table `storagemanagement`.`customer`
-- -----------------------------------------------------
CREATE TABLE `storagemanagement`.`customer` (
  `Id` INT(11) NOT NULL AUTO_INCREMENT,
  `DisplayName` VARCHAR(50) NOT NULL,
  `Address` VARCHAR(200) NOT NULL,
  `Phone` VARCHAR(20) NOT NULL,
  `Email` VARCHAR(50) NOT NULL,
  `MoreInfo` VARCHAR(200),
  `ContractDate` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (`Id`)
);

-- -----------------------------------------------------
-- Table `storagemanagement`.`export`
-- -----------------------------------------------------
CREATE TABLE `storagemanagement`.`export` (
  `Id` VARCHAR(36) NOT NULL,
  `ExportDate` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (`Id`)
);

-- -----------------------------------------------------
-- Table `storagemanagement`.`unit`
-- -----------------------------------------------------
CREATE TABLE `storagemanagement`.`unit` (
  `Id` INT(11) NOT NULL AUTO_INCREMENT,
  `DisplayName` VARCHAR(10) NOT NULL,
  PRIMARY KEY (`Id`)
);

-- -----------------------------------------------------
-- Table `storagemanagement`.`supplier`
-- -----------------------------------------------------
CREATE TABLE `storagemanagement`.`supplier` (
  `Id` INT(11) NOT NULL AUTO_INCREMENT,
  `DisplayName` VARCHAR(50) NOT NULL,
  `Address` VARCHAR(200) NOT NULL,
  `Phone` VARCHAR(20) NOT NULL,
  `Email` VARCHAR(30) NOT NULL,
  `MoreInfo` VARCHAR(200) NULL DEFAULT NULL,
  `ContractDate` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (`Id`)
);

-- -----------------------------------------------------
-- Table `storagemanagement`.`object`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `storagemanagement`.`object` (
  `Id` VARCHAR(36) NOT NULL,
  `DisplayName` VARCHAR(200) NOT NULL,
  `Unit_Id` INT(11) NOT NULL,
  `Supplier_Id` INT(11) NOT NULL,
  `QRCode` VARCHAR(10) NULL DEFAULT NULL,
  `Barcode` VARCHAR(10) NULL DEFAULT NULL,
  PRIMARY KEY (`Id`),
  FOREIGN KEY (`Unit_Id`) REFERENCES `storagemanagement`.`unit` (`Id`),
  FOREIGN KEY (`Supplier_Id`) REFERENCES `storagemanagement`.`supplier` (`Id`)
);

-- -----------------------------------------------------
-- Table `storagemanagement`.`exportinfo`
-- -----------------------------------------------------
CREATE TABLE `storagemanagement`.`exportinfo` (
  `Id` VARCHAR(36) NOT NULL,
  `Object_Id` VARCHAR(36) NOT NULL,
  `Export_Id` VARCHAR(36) NOT NULL,
  `Customer_Id` INT(11) NOT NULL,
  `Amount` INT(11) NOT NULL,
  `Status` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`Id`),
  FOREIGN KEY (`Object_Id`) REFERENCES `storagemanagement`.`object` (`Id`),
  FOREIGN KEY (`Export_Id`) REFERENCES `storagemanagement`.`export` (`Id`),
  FOREIGN KEY (`Customer_Id`) REFERENCES `storagemanagement`.`customer` (`Id`)
);

-- -----------------------------------------------------
-- Table `storagemanagement`.`import`
-- -----------------------------------------------------
CREATE TABLE `storagemanagement`.`import` (
  `Id` VARCHAR(36) NOT NULL,
  `ImportDate` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (`Id`)
);

-- -----------------------------------------------------
-- Table `storagemanagement`.`importinfo`
-- -----------------------------------------------------
CREATE TABLE `storagemanagement`.`importinfo` (
  `Id` VARCHAR(36) NOT NULL,
  `Object_Id` VARCHAR(36) NOT NULL,
  `Import_Id` VARCHAR(36) NOT NULL,
  `Amount` INT(11) NOT NULL,
  `ImportPrice` FLOAT NOT NULL,
  `ExportPrice` FLOAT NOT NULL,
  `Status` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`Id`),
  FOREIGN KEY (`Object_Id`) REFERENCES `storagemanagement`.`object` (`Id`),
  FOREIGN KEY (`Import_Id`) REFERENCES `storagemanagement`.`import` (`Id`)
);

-- -----------------------------------------------------
-- Table `storagemanagement`.`user`
-- -----------------------------------------------------
CREATE TABLE `storagemanagement`.`user` (
  `Id` INT(11) NOT NULL AUTO_INCREMENT,
  `DisplayName` VARCHAR(50) NOT NULL,
  `Username` VARCHAR(50) NOT NULL,
  `Password` VARCHAR(200) NOT NULL
  PRIMARY KEY (`Id`)
);