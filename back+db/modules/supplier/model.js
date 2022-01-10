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

    static async getById(id, storageId) {
        let query = `SELECT supplier.displayName, supplier.address, supplier.phone, supplier.email, supplier.moreInfo
        FROM supplier WHERE Id = '${id}' AND storageId='${storageId}'`;
        return await connection.queryDB(query);
    }

    static async findByInfo(name, address, phone, email, storageId) {
        let query = `SELECT * FROM supplier 
        WHERE displayName = '${name}' AND address = '${address}' AND phone = '${phone}' AND email = '${email}' AND storageId='${storageId}'`;
        return await connection.queryDB(query);
    }

    static async getAll(storageId) {
        let query = `SELECT * FROM supplier AND storageId='${storageId}'`;
        return await connection.queryDB(query);
    }

    static async post(name, address, phone, email, storageId, moreInfo = null) {
        let query = `INSERT INTO supplier (displayName, address, phone, email, moreInfo, Id, storageId) 
        VALUES ("${name}", "${address}", "${phone}", "${email}", "${moreInfo}", '${uuidv4()}', '${storageId}')`;
        return await connection.queryDB(query);
    }

    static async put(id, name, address, phone, email, storageId, moreInfo = null) {
        let query = `UPDATE supplier 
        SET displayName='${name}', address='${address}', phone='${phone}', email='${email}', moreInfo='${moreInfo}' 
        WHERE Id='${id}' AND storageId='${storageId}'`;
        return await connection.queryDB(query);
    }

    static async delete(id, storageId) {
        let query = `DELETE FROM supplier WHERE Id='${id}' AND storageId='${storageId}'`;
        return await connection.queryDB(query);
    }

    /**
     * Kiểm tra xem nhà cung cấp có trong danh sách thông tin nhập hàng không
     * @param {number} id Mã nhà cung cấp
     * @returns {boolean} 
     */
     static async isSupplierIdUsed(id, storageId) {
        let query = `SELECT Id FROM import WHERE import.supplierId='${id}' AND storageId='${storageId}'`;
        let result = await connection.queryDB(query);
        if (result.length == 0) return false;
        else return true;
    }
}

module.exports = Supplier;