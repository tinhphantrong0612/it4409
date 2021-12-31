const connection = require('../databaseConnection');
const config = require('../../config');

class Unit {
    Id;
    displayName;

    static async getById(id) {
        let query = `SELECT * FROM unit WHERE Id = ${id}`;
        return await connection.queryDB(query);
    }

    static async findByName(name) {
        let query = `SELECT * FROM unit WHERE displayName = '${name}'`;
        return await connection.queryDB(query);
    }

    static async getAll() {
        let query = `SELECT * FROM unit`;
        return await connection.queryDB(query);
    }

    static async insert(name) {
        let query = `INSERT INTO unit (displayName) VALUES ("${name}")`;
        return await connection.queryDB(query);
    }

    static async update(id, name) {
        let query = `UPDATE unit SET displayName='${name}' WHERE Id=${id}`;
        return await connection.queryDB(query);
    }

    static async delete(id) {
        let query = `DELETE FROM unit WHERE Id=${id}`;
        return await connection.queryDB(query);
    }

    /**
     * Kiểm tra đơn vị đã được sử dụng bởi mặt hàng nào chưa
     * @param {number} id Mã đơn vị
     * @returns {boolean} true - Chưa sử dụng / false - Đã sử dụng
     */
    static async isUnitIdUsed(id) {
        let query = `SELECT Id FROM object WHERE object.unitId=${id}`;
        let result = await connection.queryDB(query);
        if (result.length == 0) return false;
        else return true;
    }
}

module.exports = Unit;