const connection = require('../databaseConnection');
const IExportInfo = require('../exportInfo/model');

class IExport {
    Id;
    CustomerId;
    ExportDate;
    /**
     * Get all export record
     */
    static async getAll() {
        const query = `SELECT export.Id, export.ExportDate, export.CustomerId, customer.DisplayName as CustomerName FROM export INNER JOIN customer ON export.CustomerId = customer.Id`;
        return await connection.queryDB(query);
    }

    /**
     * Get a export record with customer name
     * @param {uuid} id 
     * @returns 
     */
    static async getById(id) {
        const queryExport = `SELECT export.Id, export.ExportDate, export.CustomerId FROM export WHERE export.Id = '${id}'`;
        const queryExportInfo = `SELECT exportInfo.Amount,
                                        exportInfo.ExportPrice,
                                        object.DisplayName as ObjectName,
                                        unit.DisplayName as UnitName,
                                        exportInfo.Id
                                FROM exportInfo
                                    INNER JOIN object ON object.Id=exportInfo.ObjectId
                                    INNER JOIN unit ON unit.Id=object.UnitId
                                WHERE exportInfo.ExportId='${id}'`;
        let [resultExport, resultExportInfo] = await Promise.all([connection.queryDB(queryExport), connection.queryDB(queryExportInfo)]);
        let finalResult = resultExport[0];
        finalResult.ExportInfoList = resultExportInfo;
        return finalResult;
    }

    /**
     * Thêm dữ liệu đơn xuất vào cơ sở dữ liệu
     * @param {uuid} exportId Mã đơn xuất, được ở controller
     * @param {IExport} data Thông tin đơn xuất
     * @returns Số dòng kết quả được thêm vào
     */
    static async insert(exportId, data) {
        let query = `INSERT INTO export (Id, ExportDate, CustomerId) VALUES ("${exportId}", '${data.ExportDate}', '${data.CustomerId}')`;
        return await connection.queryDB(query);
    }

    /**
     * Thay thế dữ liệu đơn xuất
     * @param {uuid} exportId Mã đơn xuất
     * @param {IExport} data Thông tin đơn xuất
     * @returns Số dòng kết quả được thay thế
     */
    static async update(exportId, data) {
        let query = `UPDATE export SET CustomerId='${data.CustomerId}' WHERE Id='${exportId}'`;
        return await connection.queryDB(query);
    }

    /**
     * Xóa đơn xuất
     * @param {uuid} exportId Mã đơn xuất
     * @returns Số dòng bị xóa
     */
    static async delete(exportId) {
        let query = `DELETE FROM export WHERE Id='${exportId}'`;
        return await connection.queryDB(query);
    }

    static async isCustomerExist(customerId) {
        let query = `SELECT * FROM customer WHERE Id='${customerId}'`;
        let result = await connection.queryDB(query);
        if (result.length == 0) return false;
        else return true;
    }

    static async isObjectExist(objectId) {
        let query = `SELECT * FROM object WHERE Id='${objectId}'`;
        let result = await connection.queryDB(query);
        if (result.length == 0) throw new Error(false);
        else return true;
    }

    static async isMultipleObjectsCoexist(objectIdList) {
        try {
            let promises = objectIdList.map(objectId => IExport.isObjectExist(objectId));
            await Promise.all(promises);
            return true;
        } catch (error) {
            return false;
        }
    }

    static async isAllExportAmountValid(objectList) {
        try {
            let promises = objectList.map(obj => IExport.isExportAmountValid(obj.objectId, obj.amount));
            await Promise.all(promises);
            return true;
        } catch (error) {
            return false;
        }
    }

    static async isExportAmountValid(objectId, amount) {
        try {
            let queryExport = `SELECT amount FROM exportInfo WHERE ObjectId='${objectId}'`;
            let queryImport = `SELECT amount FROM importInfo WHERE ObjectId='${objectId}'`;
            let [resultExport, resultImport] = await Promise.all([connection.queryDB(queryExport), connection.queryDB(queryImport)]);
            let totalExport = resultExport.reduce((a, b) => a + b);
            let totalImport = resultImport.reduce((a, b) => a + b);
            if (totalExport + amount > totalImport) throw new Error(false);
            else return true;
        } catch (error) {
            throw new Error(false);
        }
    }
}

module.exports = IExport;