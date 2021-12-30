const connection = require('../databaseConnection');
const config = require('../../config');
const {v4: uuidv4} = require('uuid');

class IObject {
    Id;
    displayName;
    unitId;

    static async getById(id) {
        let query = `SELECT * FROM ${config.database.database}.object WHERE Id = '${id}'`;
        return await connection.queryDB(query);
    }

    static async findByName(name) {
        let query = `SELECT * FROM ${config.database.database}.object WHERE displayName = '${name}'`;
        return await connection.queryDB(query);
    }

    static async getAll() {
        let query = `SELECT object.Id, object.DisplayName, unit.DisplayName as UnitName FROM ${config.database.database}.object INNER JOIN ${config.database.database}.unit ON ${config.database.database}.object.unitId = ${config.database.database}.unit.Id`;
        return await connection.queryDB(query);
    }

    static async insert(name, unitId) {
        let query = `INSERT INTO ${config.database.database}.object (displayName, unitId, Id) VALUES ("${name}", ${unitId}, '${uuidv4()}')`;
        return await connection.queryDB(query);
    }

    static async update(id, name, unitId) {
        let query = `UPDATE ${config.database.database}.object SET displayName='${name}', unitId=${unitId} WHERE Id='${id}'`;
        return await connection.queryDB(query);
    }

    static async delete(id) {
        let query = `DELETE FROM ${config.database.database}.object WHERE Id='${id}'`;
        return await connection.queryDB(query);
    }

    /**
     * Kiểm tra mặt hàng đã được xuất ra hay chưa
     * @param {uuid} objectId Mã mặt hàng
     * @returns {Promise<boolean>} true - Đã sử dụng/false - Chưa sử dụng
     */
    static async isExported(objectId) {
        let query = `SELECT Id FROM exportInfo WHERE ObjectId='${objectId}'`;
        const result = await connection.queryDB(query);
        if (result.length == 0) return false;
        else return true;
    }

    /**
     * Kiểm tra mặt hàng đã được nhập vào hay chưa
     * @param {uuid} objectId Mã mặt hàng
     * @returns {Promise<boolean>} true - Đã sử dụng/false - Chưa sử dụng
     */
     static async isImported(objectId) {
        let query = `SELECT Id FROM importInfo WHERE ObjectId='${objectId}'`;
        const result = await connection.queryDB(query);
        if (result.length == 0) return false;
        else return true;
    }

    /**
     * Kiểm tra đơn vị có tồn tại
     * @param {number} id Mã đơn vị
     * @returns {Promise<boolean>} true - tồn tại / false không tồn tại
     */
    static async isUnitExist(id) {
        let query = `SELECT * FROM ${config.database.database}.unit WHERE Id = ${id}`;
        const result = await connection.queryDB(query);
        if (result.length == 0) return false;
        else return true;
    }
}

module.exports = IObject;