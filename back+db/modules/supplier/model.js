const connection = require('../databaseConnection');
const config = require('../../config');
const {v4: uuidv4} = require('uuid');

class Supplier {
    Id;
    displayName;
    address;
    phone;
    email;
    moreInfo;

    static async getById(id) {
        let query = `SELECT supplier.displayName, supplier.address, supplier.phone, supplier.email, supplier.moreInfo
        FROM ${config.database.database}.supplier WHERE Id = '${id}'`;
        return await connection.queryDB(query);
    }

    static async findByInfo(name, address, phone, email) {
        let query = `SELECT * FROM ${config.database.database}.supplier 
        WHERE displayName = '${name}' AND address = '${address}' AND phone = '${phone}' AND email = '${email}'`;
        return await connection.queryDB(query);
    }

    static async getAll() {
        let query = `SELECT * FROM ${config.database.database}.supplier`;
        return await connection.queryDB(query);
    }

    static async post(name, address, phone, email, moreInfo = null) {
        let query = `INSERT INTO ${config.database.database}.supplier (displayName, address, phone, email, moreInfo, Id) 
        VALUES ("${name}", "${address}", "${phone}", "${email}", "${moreInfo}", '${uuidv4()}')`;
        return await connection.queryDB(query);
    }

    static async put(id, name, address, phone, email, moreInfo = null) {
        let query = `UPDATE ${config.database.database}.supplier 
        SET displayName='${name}', address='${address}', phone='${phone}', email='${email}', moreInfo='${moreInfo}' 
        WHERE Id='${id}'`;
        return await connection.queryDB(query);
    }

    static async delete(id) {
        let query = `DELETE FROM ${config.database.database}.supplier WHERE Id='${id}'`;
        return await connection.queryDB(query);
    }
}

module.exports = Supplier;