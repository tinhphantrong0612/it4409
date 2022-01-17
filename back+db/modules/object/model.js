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

    /**
     * Search for object
     * @param {String} name Name to search
     * @returns {Promise<List<Object>>} List of results
     */
    static async searchByName(name, storageId) {
        let query = `SELECT object.Id, object.DisplayName, unit.DisplayName as UnitName FROM object INNER JOIN unit ON object.unitId = unit.Id WHERE object.storageId='${storageId}' AND object.DisplayName LIKE '%${name}%'`;
        return await connection.queryDB(query);
    }

    /**
     * Search with paging
     */
    static async searchByNameWithPaging(name, pageNumber, pageSize, storageId) {
        let startAfter = (pageNumber-1) * pageSize;
        let query = `SELECT object.Id, object.DisplayName, unit.DisplayName as UnitName FROM object INNER JOIN unit ON object.unitId = unit.Id WHERE object.storageId='${storageId}' AND object.DisplayName LIKE '%${name}%' LIMIT ${startAfter}, ${pageSize}`;
        let queryCount = `SELECT Count(object.Id) as totalRecord FROM object INNER JOIN unit ON object.unitId = unit.Id WHERE object.storageId='${storageId}' AND object.DisplayName LIKE '%${name}%'`;
        let [data, countResult] = await Promise.all([connection.queryDB(query), connection.queryDB(queryCount)]);
        let totalRecord = countResult[0].totalRecord;
        let totalPage = totalRecord % pageSize == 0 && totalRecord !== 0 ? totalRecord / pageSize : Math.floor(totalRecord/pageSize) + 1;
        return {
            totalRecord,
            totalPage,
            data
        }
    }
}

module.exports = IObject;