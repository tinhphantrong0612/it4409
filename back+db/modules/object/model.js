const connection = require('../databaseConnection');
const config = require('../../config');
const { v4: uuidv4 } = require('uuid');

class IObject {
    Id;
    displayName;
    unitId;

    static async getById(id, storageId) {
        let query = `SELECT * FROM object WHERE Id = '${id}' AND storageId='${storageId}'`;
        return await connection.queryDB(query);
    }

    static async findByName(name, storageId) {
        let query = `SELECT * FROM object WHERE displayName = '${name}' AND storageId='${storageId}'`;
        return await connection.queryDB(query);
    }

    static async getAll(storageId) {
        let query = `SELECT object.Id, object.DisplayName, unit.DisplayName as UnitName FROM object INNER JOIN unit ON object.unitId = unit.Id WHERE object.storageId='${storageId}'`;
        return await connection.queryDB(query);
    }

    static async search(term, storageId) {
        let query = `SELECT object.Id, object.DisplayName, unit.DisplayName as UnitName FROM object INNER JOIN unit ON object.unitId = unit.Id WHERE object.storageId='${storageId}' AND object.DisplayName LIKE '%${term}%'`;
        return await connection.queryDB(query);
    }

    static async insert(name, unitId, storageId) {
        let query = `INSERT INTO object (displayName, unitId, Id, storageId) VALUES ("${name}", ${unitId}, '${uuidv4()}', '${storageId}')`;
        return await connection.queryDB(query);
    }

    static async update(id, name, unitId, storageId) {
        let query = `UPDATE object SET displayName='${name}', unitId=${unitId} WHERE Id='${id}' AND storageId='${storageId}'`;
        return await connection.queryDB(query);
    }

    static async delete(id, storageId) {
        let query = `DELETE FROM object WHERE Id='${id}' AND storageId='${storageId}'`;
        return await connection.queryDB(query);
    }

    /**
     * Kiểm tra mặt hàng đã được xuất ra hay chưa
     * @param {uuid} objectId Mã mặt hàng
     * @returns {Promise<boolean>} true - Đã sử dụng/false - Chưa sử dụng
     */
    static async isExported(objectId, storageId) {
        let query = `SELECT Id FROM exportInfo WHERE ObjectId='${objectId}' AND storageId='${storageId}'`;
        const result = await connection.queryDB(query);
        if (result.length == 0) return false;
        else return true;
    }

    /**
     * Kiểm tra mặt hàng đã được nhập vào hay chưa
     * @param {uuid} objectId Mã mặt hàng
     * @returns {Promise<boolean>} true - Đã sử dụng/false - Chưa sử dụng
     */
    static async isImported(objectId, storageId) {
        let query = `SELECT Id FROM importInfo WHERE ObjectId='${objectId}' AND storageId='${storageId}'`;
        const result = await connection.queryDB(query);
        if (result.length == 0) return false;
        else return true;
    }

    /**
     * Kiểm tra đơn vị có tồn tại
     * @param {number} id Mã đơn vị
     * @returns {Promise<boolean>} true - tồn tại / false không tồn tại
     */
    static async isUnitExist(id, storageId) {
        let query = `SELECT * FROM unit WHERE Id = ${id} AND storageId='${storageId}'`;
        const result = await connection.queryDB(query);
        if (result.length == 0) return false;
        else return true;
    }
}

module.exports = IObject;