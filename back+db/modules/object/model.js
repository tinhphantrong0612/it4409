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
}

module.exports = IObject;