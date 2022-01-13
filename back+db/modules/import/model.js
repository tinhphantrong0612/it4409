const connection = require('../databaseConnection');
const config = require('../../config');

class IImport {
    Id;
    SupplierId;
    ImportDate;
    /**
     * Get all import record
     */
    static async getAll(storageId) {
        const query = `SELECT import.Id,
                                import.ImportDate,
                                import.SupplierId,
                                supplier.DisplayName as SupplierName
                        FROM import
                            INNER JOIN supplier ON import.SupplierId = supplier.Id WHERE import.storageId='${storageId}'`;
        return await connection.queryDB(query);
    }

    /**
     * Get a import record with supplier name
     * @param {uuid} id 
     * @returns 
     */
    static async getById(id, storageId) {
        const queryImport = `SELECT import.Id, import.ImportDate, import.SupplierId FROM import WHERE import.Id = '${id}' AND storageId='${storageId}'`;
        const queryImportInfo = `SELECT
                                    importInfo.Barcode,
                                    importInfo.ImportPrice,
                                    importInfo.Amount,
                                    importInfo.Id,
                                    unit.DisplayName as UnitName,
                                    object.DisplayName as ObjectName
                                FROM importInfo
                                    INNER JOIN object ON importInfo.ObjectId=object.Id
                                    INNER JOIN unit ON object.UnitId=unit.Id
                                WHERE importInfo.ImportId='${id}' AND importInfo.storageId='${storageId}'`;
        let [resultImport, resultImportInfo] = await Promise.all([connection.queryDB(queryImport), connection.queryDB(queryImportInfo)]);
        if (resultImport.length == 0) return {};
        else if (resultImportInfo.length == 0) {
            await IImport.delete(id, storageId);
            return {};
        }
        let finalResult = resultImport[0];
        finalResult.ImportInfoList = resultImportInfo;
        return finalResult;
    }

    /**
     * Thêm dữ liệu đơn xuất vào cơ sở dữ liệu
     * @param {uuid} importId Mã đơn xuất, được ở controller
     * @param {IImport} data Thông tin đơn xuất
     * @returns Số dòng kết quả được thêm vào
     */
    static async insert(importId, storageId, data) {
        let query = `INSERT INTO import (Id, ImportDate, SupplierId, storageId) VALUES ("${importId}", '${data.ImportDate}', '${data.SupplierId}', '${storageId}')`;
        return await connection.queryDB(query);
    }

    /**
     * Thay thế dữ liệu đơn xuất
     * @param {uuid} importId Mã đơn xuất
     * @param {IImport} data Thông tin đơn xuất
     * @returns Số dòng kết quả được thay thế
     */
    static async update(importId, storageId, data) {
        let query = `UPDATE import SET SupplierId='${data.SupplierId}' WHERE Id='${importId}' AND StorageId='${storageId}'`;
        return await connection.queryDB(query);
    }

    /**
     * Xóa đơn nhập
     * @param {uuid} importId Mã đơn nhập
     * @returns Số dòng bị xóa
     */
    static async delete(importId, storageId) {
        let query = `DELETE FROM import WHERE Id='${importId}' AND storageId='${storageId}'`;
        return await connection.queryDB(query);
    }

    static async isSupplierExist(supplierId, storageId) {
        let query = `SELECT * FROM supplier WHERE Id='${supplierId}' AND storageId='${storageId}'`;
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
            let promises = objectIdList.map(objectId => IImport.isObjectExist(objectId, storageId));
            let results = await Promise.all(promises);
            return true;
        } catch (error) {
            return false;
        }
    }

    static async searchBySupplierName(supplierName, storageId) {
        let query = `SELECT import.Id,
                                import.ImportDate,
                                import.SupplierId,
                                supplier.DisplayName as SupplierName
                        FROM import
                            INNER JOIN supplier ON import.SupplierId = supplier.Id WHERE import.storageId='${storageId}' AND supplier.DisplayName LIKE '%${supplierName}%'`;
        return await connection.queryDB(query);
    }
}

module.exports = IImport;