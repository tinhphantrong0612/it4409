-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema storagemanagement
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema storagemanagement
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `storagemanagement` DEFAULT CHARACTER SET utf8mb4 ;
USE `storagemanagement` ;

-- -----------------------------------------------------
-- Table `storagemanagement`.`customer`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `storagemanagement`.`customer` (
  `Id` INT(11) NOT NULL AUTO_INCREMENT,
  `DisplayName` VARCHAR(50) NOT NULL,
  `Address` VARCHAR(200) NOT NULL,
  `Phone` VARCHAR(20) NOT NULL,
  `Email` VARCHAR(50) NOT NULL,
  `MoreInfo` VARCHAR(200) NOT NULL,
  `ContractDate` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (`Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `storagemanagement`.`export`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `storagemanagement`.`export` (
  `Id` VARCHAR(36) NOT NULL,
  `ExportDate` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (`Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `storagemanagement`.`unit`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `storagemanagement`.`unit` (
  `Id` INT(11) NOT NULL AUTO_INCREMENT,
  `DisplayName` VARCHAR(10) NOT NULL,
  PRIMARY KEY (`Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `storagemanagement`.`supplier`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `storagemanagement`.`supplier` (
  `Id` INT(11) NOT NULL AUTO_INCREMENT,
  `DisplayName` VARCHAR(50) NOT NULL,
  `Address` VARCHAR(200) NOT NULL,
  `Phone` VARCHAR(20) NOT NULL,
  `Email` VARCHAR(30) NOT NULL,
  `MoreInfo` VARCHAR(200) NULL DEFAULT NULL,
  `ContractDate` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (`Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `storagemanagement`.`object`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `storagemanagement`.`object` (
  `Id` VARCHAR(36) NOT NULL,
  `DisplayName` VARCHAR(200) NOT NULL,
  `unit_Id` INT(11) NOT NULL,
  `supplier_Id` INT(11) NOT NULL,
  `QRCode` VARCHAR(10) NULL DEFAULT NULL,
  `Barcode` VARCHAR(10) NULL DEFAULT NULL,
  PRIMARY KEY (`Id`),
  CONSTRAINT `fk_object_unit1`
    FOREIGN KEY (`unit_Id`)
    REFERENCES `storagemanagement`.`unit` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_object_supplier1`
    FOREIGN KEY (`supplier_Id`)
    REFERENCES `storagemanagement`.`supplier` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `storagemanagement`.`exportinfo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `storagemanagement`.`exportinfo` (
  `Id` VARCHAR(36) NOT NULL,
  `object_Id` VARCHAR(36) NOT NULL,
  `export_Id` VARCHAR(36) NOT NULL,
  `customer_Id` INT(11) NOT NULL,
  `Amount` INT(11) NOT NULL,
  `Status` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`Id`),
  CONSTRAINT `fk_exportinfo_object1`
    FOREIGN KEY (`object_Id`)
    REFERENCES `storagemanagement`.`object` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_exportinfo_export1`
    FOREIGN KEY (`export_Id`)
    REFERENCES `storagemanagement`.`export` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_exportinfo_customer1`
    FOREIGN KEY (`customer_Id`)
    REFERENCES `storagemanagement`.`customer` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `storagemanagement`.`import`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `storagemanagement`.`import` (
  `Id` VARCHAR(36) NOT NULL,
  `ImportDate` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (`Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `storagemanagement`.`importinfo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `storagemanagement`.`importinfo` (
  `Id` VARCHAR(36) NOT NULL,
  `object_Id` VARCHAR(36) NOT NULL,
  `import_Id` VARCHAR(36) NOT NULL,
  `Amount` INT(11) NOT NULL,
  `ImportPrice` FLOAT NOT NULL,
  `ExportPrice` FLOAT NOT NULL,
  `Status` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`Id`),
  CONSTRAINT `fk_importinfo_object1`
    FOREIGN KEY (`object_Id`)
    REFERENCES `storagemanagement`.`object` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_importinfo_import1`
    FOREIGN KEY (`import_Id`)
    REFERENCES `storagemanagement`.`import` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `storagemanagement`.`userrole`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `storagemanagement`.`userrole` (
  `DisplayName` VARCHAR(50) NOT NULL,
  `Id` INT(11) NOT NULL,
  PRIMARY KEY (`Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `storagemanagement`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `storagemanagement`.`user` (
  `Id` INT(11) NOT NULL AUTO_INCREMENT,
  `DisplayName` VARCHAR(50) NOT NULL,
  `Username` VARCHAR(50) NOT NULL,
  `Password` VARCHAR(200) NOT NULL,
  `userrole_Id` INT(11) NOT NULL,
  PRIMARY KEY (`Id`),
  CONSTRAINT `fk_user_userrole`
    FOREIGN KEY (`userrole_Id`)
    REFERENCES `storagemanagement`.`userrole` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
