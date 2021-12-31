const connection = require('../databaseConnection');
const config = require('../../config');

class IImport {
    Id;
    SupplierId;
    ImportDate;
    /**
     * Get all import record
     */
    static async getAll() {
        const query = `SELECT * FROM ${config.database.database}.import`;
        return await connection.queryDB(query);
    }

    /**
     * Get a import record with supplier name
     * @param {uuid} id 
     * @returns 
     */
    static async getById(id) {
        const query = `SELECT import.Id, import.ImportDate, import.SupplierId,supplier.DisplayName as SupplierName FROM import INNER JOIN supplier ON import.SupplierId = supplier.Id WHERE import.Id = '${id}'`;
        return await connection.queryDB(query);
    }

    /**
     * Thêm dữ liệu đơn xuất vào cơ sở dữ liệu
     * @param {uuid} importId Mã đơn xuất, được ở controller
     * @param {IImport} data Thông tin đơn xuất
     * @returns Số dòng kết quả được thêm vào
     */
    static async insert(importId, data) {
        let query = `INSERT INTO ${config.database.database}.import (Id, ImportDate, SupplierId) VALUES ("${importId}", '${data.ImportDate}', '${data.SupplierId}')`;
        return await connection.queryDB(query);
    }

    /**
     * Thay thế dữ liệu đơn xuất
     * @param {uuid} importId Mã đơn xuất
     * @param {IImport} data Thông tin đơn xuất
     * @returns Số dòng kết quả được thay thế
     */
    static async update(importId, data) {
        let query = `UPDATE ${config.database.database}.import SET SupplierId='${data.SupplierId}' WHERE Id='${importId}'`;
        return await connection.queryDB(query);
    }

    /**
     * Xóa đơn nhập
     * @param {uuid} importId Mã đơn nhập
     * @returns Số dòng bị xóa
     */
    static async delete(importId) {
        let query = `DELETE FROM ${config.database.database}.import WHERE Id='${importId}'`;
        return await connection.queryDB(query);
    }

    static async isSupplierExist(supplierId) {
        let query = `SELECT * FROM supplier WHERE Id='${supplierId}'`;
        let result = await connection.queryDB(query);
        if (result.length == 0) return false;
        else return true;
    }

    static async isObjectExist(objectId) {
        let query = `SELECT * FROM object WHERE Id='${objectId}'`;
        let result = await connection.queryDB(query);
        if (result.length == 0) throw new Error(false);
        else return true;
    }

    static async isMultipleCoexist(objectIdList) {
        try {
            let promises = objectIdList.map(objectId => IImport.isObjectExist(objectId));
            let results = await Promise.all(promises);
            return true;
        } catch (error) {
            return false;
        }
    }
}

module.exports = IImport;