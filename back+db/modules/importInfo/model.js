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
}

module.exports = IImportInfo;