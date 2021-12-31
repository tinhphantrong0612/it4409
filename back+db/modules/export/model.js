const connection = require('../databaseConnection');
const config = require('../../config');
const {v4: uuidv4} = require('uuid');

class IExport {
    Id;
    CustomerId;
    ExportDate;
    /**
     * Get all export record
     */
    static async getAll() {
        const query = `SELECT * FROM ${config.database.database}.export`;
        return await connection.queryDB(query);
    }

    /**
     * Get a export record with customer name
     * @param {uuid} id 
     * @returns 
     */
    static async getById(id) {
        const query = `SELECT ${config.database.database}.export.Id, ${config.database.database}.export.ExportDate, ${config.database.database}.export.CustomerId, ${config.database.database}.customer.DisplayName as CustomerName FROM ${config.database.database}.export INNER JOIN ${config.database.database}.customer ON ${config.database.database}.export.CustomerId = ${config.database.database}.customer.Id WHERE ${config.database.database}.export.Id = '${id}'`;
        return await connection.queryDB(query);
    }

    /**
     * Thêm dữ liệu đơn xuất vào cơ sở dữ liệu
     * @param {uuid} exportId Mã đơn xuất, được ở controller
     * @param {IExport} data Thông tin đơn xuất
     * @returns Số dòng kết quả được thêm vào
     */
    static async insert(exportId, data) {
        let query = `INSERT INTO ${config.database.database}.export (Id, ExportDate, CustomerId) VALUES ("${exportId}", '${data.ExportDate}', '${data.CustomerId}')`;
        return await connection.queryDB(query);
    }

    /**
     * Thay thế dữ liệu đơn xuất
     * @param {uuid} exportId Mã đơn xuất
     * @param {IExport} data Thông tin đơn xuất
     * @returns Số dòng kết quả được thay thế
     */
    static async update(exportId, data) {
        let query = `UPDATE ${config.database.database}.export SET CustomerId='${data.CustomerId}' WHERE Id='${exportId}'`;
        return await connection.queryDB(query);
    }

    /**
     * Xóa đơn xuất
     * @param {uuid} exportId Mã đơn xuất
     * @returns Số dòng bị xóa
     */
    static async delete(exportId) {
        let query = `DELETE FROM ${config.database.database}.export WHERE Id='${exportId}'`;
        return await connection.queryDB(query);
    }

    static async isCustomerExist(customerId) {
        let query = `SELECT * FROM customer WHERE Id='${customerId}'`;
        let result = await connection.queryDB(query);
        if (result.length == 0) return false;
        else return true;
    }
}

module.exports = IExport;