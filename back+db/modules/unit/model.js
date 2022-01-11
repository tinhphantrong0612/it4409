const connection = require('../databaseConnection');
const config = require('../../config');

class Unit {
    Id;
    displayName;

    static async getById(id, storageId) {
        let query = `SELECT * FROM unit WHERE Id = ${id} AND storageId='${storageId}'`;
        return await connection.queryDB(query);
    }

    static async findByName(name, storageId) {
        let query = `SELECT * FROM unit WHERE displayName = '${name}' AND storageId='${storageId}'`;
        return await connection.queryDB(query);
    }

    static async getAll(storageId) {
        let query = `SELECT * FROM unit WHERE storageId='${storageId}'`;
        return await connection.queryDB(query);
    }

    static async insert(name, storageId) {
        let query = `INSERT INTO unit (displayName, storageId) VALUES ("${name}", '${storageId}')`;
        return await connection.queryDB(query);
    }

    static async update(id, name, storageId) {
        let query = `UPDATE unit SET displayName='${name}' WHERE Id=${id} AND StorageId='${storageId}'`;
        return await connection.queryDB(query);
    }

    static async delete(id, storageId) {
        let query = `DELETE FROM unit WHERE Id=${id} AND storageId='${storageId}'`;
        return await connection.queryDB(query);
    }

    /**
     * Kiểm tra đơn vị đã được sử dụng bởi mặt hàng nào chưa
     * @param {number} id Mã đơn vị
     * @returns {boolean} true - Chưa sử dụng / false - Đã sử dụng
     */
    static async isUnitIdUsed(id, storageId) {
        let query = `SELECT Id FROM object WHERE object.unitId=${id} AND storageId='${storageId}'`;
        let result = await connection.queryDB(query);
        if (result.length == 0) return false;
        else return true;
    }
}

module.exports = Unit;