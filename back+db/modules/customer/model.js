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

    static async getById(id, storageId) {
        let query = `SELECT customer.displayName, customer.address, customer.phone, customer.email, customer.moreInfo
        FROM customer WHERE Id = '${id}' AND StorageId='${storageId}'`;
        return await connection.queryDB(query);
    }

    static async findByInfo(name, address, phone, email, storageId) {
        let query = `SELECT * FROM customer 
        WHERE displayName = '${name}' AND address = '${address}' AND phone = '${phone}' AND email = '${email}' AND StorageId='${storageId}'`;
        return await connection.queryDB(query);
    }

    static async getAll(storageId) {
        let query = `SELECT * FROM customer WHERE StorageId='${storageId}'`;
        return await connection.queryDB(query);
    }

    static async post(name, address, phone, email, storageId, moreInfo = null) {
        let query = `INSERT INTO customer (displayName, address, phone, email, moreInfo, Id, storageId) 
        VALUES ("${name}", "${address}", "${phone}", "${email}", "${moreInfo}", '${uuidv4()}', "${storageId}")`;
        return await connection.queryDB(query);
    }

    static async put(id, name, address, phone, email, storageId, moreInfo = null) {
        let query = `UPDATE customer 
        SET displayName='${name}', address='${address}', phone='${phone}', email='${email}', moreInfo='${moreInfo}' 
        WHERE Id='${id}' AND StorageId='${storageId}'`;
        return await connection.queryDB(query);
    }

    static async delete(id, storageId) {
        let query = `DELETE FROM customer WHERE Id='${id}' AND StorageId='${storageId}'`;
        return await connection.queryDB(query);
    }

    /**
     * Kiểm tra xem khách hàng có trong danh sách thông tin xuất hàng không
     * @param {number} id Mã khách hàng
     * @returns {boolean} 
     */
    static async isCustomerIdUsed(id, storageId) {
        let query = `SELECT Id FROM export WHERE export.customerId='${id}' AND StorageId='${storageId}'`;
        let result = await connection.queryDB(query);
        if (result.length == 0) return false;
        else return true;
    }

    static async getSearchResult(term, pageSize, pageNumber, storageId) {
        let startAfter = (pageNumber-1) * pageSize;
        let query = `SELECT * FROM Customer WHERE storageId='${storageId}' AND (DisplayName LIKE '%${term}%' OR Email LIKE '%${term}%' OR Phone LIKE '%${term}%') LIMIT ${startAfter}, ${pageSize}`;
        let queryCount = `SELECT Count(Id) as totalRecord FROM Customer WHERE storageId='${storageId}' AND (DisplayName LIKE '%${term}%' OR Email LIKE '%${term}%' OR Phone LIKE '%${term}%')`;
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

module.exports = Customer;