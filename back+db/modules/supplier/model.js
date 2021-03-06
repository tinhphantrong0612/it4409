const connection = require('../databaseConnection');
const config = require('../../config');
const { v4: uuidv4 } = require('uuid');

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
        let query = `SELECT * FROM supplier WHERE storageId='${storageId}'`;
        return await connection.queryDB(query);
    }

    static async search(term, pageSize, pageNumber, storageId) {
        let startAfter = (pageNumber-1) * pageSize;
        let query = `SELECT * FROM Supplier WHERE storageId='${storageId}' AND (DisplayName LIKE '%${term}%' OR Email LIKE '%${term}%' OR Phone LIKE '%${term}%') LIMIT ${startAfter}, ${pageSize}`;
        let queryCount = `SELECT Count(Id) as totalRecord FROM Supplier WHERE storageId='${storageId}' AND (DisplayName LIKE '%${term}%' OR Email LIKE '%${term}%' OR Phone LIKE '%${term}%')`;
        let [data, countResult] = await Promise.all([connection.queryDB(query), connection.queryDB(queryCount)]);
        let totalRecord = countResult[0].totalRecord;
        let totalPage = totalRecord % pageSize == 0 && totalRecord !== 0 ? totalRecord / pageSize : Math.floor(totalRecord/pageSize) + 1;
        return {
            totalRecord,
            totalPage,
            data
        }
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
     * Ki???m tra xem nh?? cung c???p c?? trong danh s??ch th??ng tin nh???p h??ng kh??ng
     * @param {number} id M?? nh?? cung c???p
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