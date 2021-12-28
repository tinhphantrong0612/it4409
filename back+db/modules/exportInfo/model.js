const connection = require('../databaseConnection');
const config = require('../../config');
const {v4: uuidv4} = require('uuid');

class IEmportInfo {
    /**
     * Get total amout of object and price
     * @param {uuid} objectId
     */
    static async getTotalObjectAmoutAndPrice(objectId) {
        let query = `SELECT exportPrice, amount FROM ${config.database.database}.exportInfo WHERE objectId = '${objectId}'`;
        let result = {
            amount: 0,
            exportPrice: 0
        }
        let queryResult = await connection.queryDB(query);
        for (const singleImport of queryResult) {
            result.amount += singleImport.amount;
            result.exportPrice += singleImport.exportPrice;
        }
        return result;
    }
}

module.exports = IEmportInfo;