const connection = require('../databaseConnection');
const config = require('../../config');

class Unit {
    Id;
    displayName;

    static async getById(id) {
        let query = `SELECT * FROM ${config.database.database}.unit WHERE Id = '${id}'`;
        return await connection.queryDB(query);
    }

    static async findByName(name) {
        let query = `SELECT * FROM ${config.database.database}.unit WHERE displayName = '${name}'`;
        return await connection.queryDB(query);
    }

    static async getAll() {
        let query = `SELECT * FROM ${config.database.database}.unit`;
        return await connection.queryDB(query);
    }

    static async post(name) {
        let query = `INSERT INTO ${config.database.database}.unit (displayName) VALUES ("${name}")`;
        return await connection.queryDB(query);
    }

    static async put(id, name) {
        let query = `UPDATE ${config.database.database}.unit SET displayName='${name}' WHERE Id=${id}`;
        return await connection.queryDB(query);
    }

    static async delete(id, name) {
        let query = `DELETE FROM ${config.database.database}.unit WHERE Id=${id}`;
        return await connection.queryDB(query);
    }
}

module.exports = Unit;