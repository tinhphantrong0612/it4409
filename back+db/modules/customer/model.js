const connection = require('../databaseConnection');
const config = require('../../config');
const {v4: uuidv4} = require('uuid');

class Customer {
    Id;
    displayName;
    address;
    phone;
    email;
    moreInfo;

    static async getById(id) {
        let query = `SELECT customer.displayName, customer.address, customer.phone, customer.email, customer.moreInfo
        FROM customer WHERE Id = '${id}'`;
        return await connection.queryDB(query);
    }

    static async findByInfo(name, address, phone, email) {
        let query = `SELECT * FROM customer 
        WHERE displayName = '${name}' AND address = '${address}' AND phone = '${phone}' AND email = '${email}'`;
        return await connection.queryDB(query);
    }

    static async getAll() {
        let query = `SELECT * FROM customer`;
        return await connection.queryDB(query);
    }

    static async post(name, address, phone, email, moreInfo = null) {
        let query = `INSERT INTO customer (displayName, address, phone, email, moreInfo, Id) 
        VALUES ("${name}", "${address}", "${phone}", "${email}", "${moreInfo}", '${uuidv4()}')`;
        return await connection.queryDB(query);
    }

    static async put(id, name, address, phone, email, moreInfo = null) {
        let query = `UPDATE customer 
        SET displayName='${name}', address='${address}', phone='${phone}', email='${email}', moreInfo='${moreInfo}' 
        WHERE Id='${id}'`;
        return await connection.queryDB(query);
    }

    static async delete(id) {
        let query = `DELETE FROM customer WHERE Id='${id}'`;
        return await connection.queryDB(query);
    }

    /**
     * Kiểm tra xem khách hàng có trong danh sách thông tin xuất hàng không
     * @param {number} id Mã khách hàng
     * @returns {boolean} 
     */
    static async isCustomerIdUsed(id) {
        let query = `SELECT Id FROM export WHERE export.customerId='${id}'`;
        let result = await connection.queryDB(query);
        if (result.length == 0) return false;
        else return true;
    }
}

module.exports = Customer;