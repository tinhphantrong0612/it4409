const connection = require('../databaseConnection');
const IExportInfo = require('../exportInfo/model');

class IExport {
    Id;
    CustomerId;
    ExportDate;
    /**
     * Get all export record
     */
    static async getAll(storageId) {
        const query = `SELECT export.Id, export.ExportDate, export.CustomerId, customer.DisplayName as CustomerName FROM export INNER JOIN customer ON export.CustomerId = customer.Id WHERE export.StorageId='${storageId}'`;
        return await connection.queryDB(query);
    }

    /**
     * Get a export record with customer name
     * @param {uuid} id 
     * @returns 
     */
    static async getById(id, storageId) {
        const queryExport = `SELECT export.Id, export.ExportDate, export.CustomerId FROM export WHERE export.Id = '${id}'`;
        const queryExportInfo = `SELECT exportInfo.Amount,
                                        exportInfo.ExportPrice,
                                        object.DisplayName as ObjectName,
                                        unit.DisplayName as UnitName,
                                        exportInfo.Id
                                FROM exportInfo
                                    INNER JOIN object ON object.Id=exportInfo.ObjectId
                                    INNER JOIN unit ON unit.Id=object.UnitId
                                WHERE exportInfo.ExportId='${id}' AND exportInfo.StorageId='${storageId}'`;
        let [resultExport, resultExportInfo] = await Promise.all([connection.queryDB(queryExport), connection.queryDB(queryExportInfo)]);
        if (resultExport.length == 0) return {};
        else if (resultExportInfo.length == 0) {
            await IExport.delete(id, storageId);
            return {};
        }
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
    static async insert(exportId, storageId, data) {
        let query = `INSERT INTO export (Id, ExportDate, CustomerId, storageId) VALUES ("${exportId}", '${data.ExportDate}', '${data.CustomerId}', '${storageId}')`;
        return await connection.queryDB(query);
    }

    /**
     * Thay thế dữ liệu đơn xuất
     * @param {uuid} exportId Mã đơn xuất
     * @param {IExport} data Thông tin đơn xuất
     * @returns Số dòng kết quả được thay thế
     */
    static async update(exportId, storageId, data) {
        let query = `UPDATE export SET CustomerId='${data.CustomerId}' WHERE Id='${exportId}' AND StorageId='${storageId}'`;
        return await connection.queryDB(query);
    }

    /**
     * Xóa đơn xuất
     * @param {uuid} exportId Mã đơn xuất
     * @returns Số dòng bị xóa
     */
    static async delete(exportId, storageId) {
        let query = `DELETE FROM export WHERE Id='${exportId}' AND storageId='${storageId}'`;
        return await connection.queryDB(query);
    }

    static async isCustomerExist(customerId, storageId) {
        let query = `SELECT * FROM customer WHERE Id='${customerId}' AND storageId='${storageId}'`;
        let result = await connection.queryDB(query);
        if (result.length == 0) return false;
        else return true;
    }

    static async isObjectExist(objectId, storageId) {
        let query = `SELECT * FROM object WHERE Id='${objectId}' AND storageId='${storageId}'`;
        let result = await connection.queryDB(query);
        if (result.length == 0) throw new Error(false);
        else return true;
    }

    static async isMultipleObjectsCoexist(objectIdList, storageId) {
        try {
            let promises = objectIdList.map(objectId => IExport.isObjectExist(objectId, storageId));
            await Promise.all(promises);
            return true;
        } catch (error) {
            return false;
        }
    }

    static async isAllExportAmountValid(objectList, storageId) {
        try {
            let promises = objectList.map(obj => IExport.isExportAmountValid(obj.objectId, obj.amount, storageId));
            await Promise.all(promises);
            return true;
        } catch (error) {
            return false;
        }
    }

    static async isExportAmountValid(objectId, amount, storageId) {
        try {
            let queryExport = `SELECT Amount FROM exportInfo WHERE ObjectId='${objectId}' WHERE storageId='${storageId}'`;
            let queryImport = `SELECT Amount FROM importInfo WHERE ObjectId='${objectId}' WHERE storageId='${storageId}'`;
            let [resultExport, resultImport] = await Promise.all([connection.queryDB(queryExport), connection.queryDB(queryImport)]);
            resultExport.unshift(0);
            resultExport.unshift(0);
            let totalExport = resultExport.reduce((a, b) => a + b.Amount);
            let totalImport = resultImport.reduce((a, b) => a + b.Amount);
            if (totalExport + amount > totalImport) throw new Error(false);
            else return true;
        } catch (error) {
            throw new Error(false);
        }
    }
}

module.exports = IExport;