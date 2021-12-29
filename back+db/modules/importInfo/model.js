const connection = require('../databaseConnection');
const config = require('../../config');
const {v4: uuidv4} = require('uuid');

class IImportInfo {
    /**
     * Get total amout of object and price
     * @param {uuid} objectId
     */
    static async getTotalObjectAmoutAndPrice(objectId) {
        let query = `SELECT importPrice, amount FROM ${config.database.database}.importInfo WHERE objectId = '${objectId}'`;
        let result = {
            amount: 0,
            importMoney: 0
        }
        let queryResult = await connection.queryDB(query);
        for (const singleImport of queryResult) {
            result.amount += singleImport.amount;
            result.importMoney += singleImport.importPrice * singleImport.amount;
        }
        return result;
    }

    /**
     * Trả về số lượng đã nhập vào của một mặt hàng
     * @param {uuid} objectId Id của object nhập vào
     * @returns Tổng số object đã nhập kho
     */
     static async getTotalImportAmount(objectId) {
        let query = `SELECT amount FROM importInfo WHERE objectId='${objectId}'`;
        const result = await connection.queryDB(query);
        return result.reduce((a, b) => a + b);
    }
}

module.exports = IImportInfo;