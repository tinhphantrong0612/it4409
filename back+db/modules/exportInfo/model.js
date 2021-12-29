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
            exportMoney: 0
        }
        let queryResult = await connection.queryDB(query);
        for (const singleExport of queryResult) {
            result.amount += singleExport.amount;
            result.exportMoney += singleExport.exportPrice * singleExport.amount;
        }
        return result;
    }

    static async insertSingleExportInfo(exportId, exportInfo) {
        let query = `INSERT INTO ${config.database.database}.exportInfo (Id, ObjectId, ExportId, Amount, ExportPrice) VALUES ("${uuidv4()}", '${exportInfo.ObjectId}', '${exportId}', ${exportInfo.Amount}, ${exportInfo.ExportPrice})`;
        return await connection.queryDB(query);
    }

    static async insertExportInfoList(exportId, exportInfoList) {
        const promises = exportInfoList.map(exportInfo => insertSingleExportInfo(exportId, exportInfo))
        return await Promise.allSettled(promises);
    }
}

module.exports = IEmportInfo;