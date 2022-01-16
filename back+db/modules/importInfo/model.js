const connection = require('../databaseConnection');
const config = require('../../config');
const { v4: uuidv4 } = require('uuid');

class IImportInfo {
    /**
     * Get total amout of object and price
     * @param {uuid} objectId
     */
    static async getTotalObjectImportAmoutAndPrice(objectId, storageId) {
        let query = `SELECT ImportPrice, Amount FROM importInfo WHERE objectId = '${objectId}' AND storageId='${storageId}'`;
        let result = {
            Amount: 0,
            ImportMoney: 0
        }
        let queryResult = await connection.queryDB(query);
        for (const singleImport of queryResult) {
            result.Amount += singleImport.Amount;
            result.ImportMoney += singleImport.ImportPrice * singleImport.Amount;
        }
        return result;
    }

    /**
     * Trả về số lượng đã nhập vào của một mặt hàng
     * @param {uuid} objectId Id của object nhập vào
     * @returns Tổng số object đã nhập kho
     */
    static async getTotalImportAmount(objectId, storageId) {
        let query = `SELECT Amount FROM importInfo WHERE objectId='${objectId}' AND storageId='${storageId}'`;
        const result = await connection.queryDB(query);
        result.unshift(0);
        return result.reduce((a, b) => a + b.Amount);
    }

    static async getAll(storageId) {
        let query = `SELECT
                        importInfo.ObjectId,
                        importInfo.Barcode,
                        importInfo.ImportPrice,
                        importInfo.Amount,
                        importInfo.Id,
                        importInfo.ImportId,
                        import.ImportDate as ImportDate,
                        supplier.DisplayName as SupplierName
                    FROM importInfo
                        INNER JOIN import ON importInfo.ImportId=import.Id
                        INNER JOIN Supplier ON import.SupplierId=Supplier.Id
                        INNER JOIN Object ON importId.ObjectId=Object.Id
                        INNER JOIN Unit ON Object.UnitId=Unit.Id
                    WHERE import.storageId='${storageId}'`;
        return await connection.queryDB(query);
    }

    static async getById(id, storageId) {
        let query = `SELECT
                        importInfo.ObjectId,
                        object.DisplayName as ObjectName,
                        importInfo.Barcode,
                        importInfo.ImportPrice,
                        importInfo.Amount,
                        unit.DisplayName as UnitName,
                        import.ImportDate as ImportDate,
                        supplier.DisplayName as SupplierName
                    FROM importInfo
                        INNER JOIN import ON importInfo.ImportId=import.Id
                        INNER JOIN supplier ON import.SupplierId=supplier.Id
                        INNER JOIN object ON importInfo.ObjectId=object.Id
                        INNER JOIN unit ON object.UnitId=unit.Id
                    WHERE importInfo.Id='${id}' AND importInfo.storageId='${storageId}'`;
        return await connection.queryDB(query);
    }

    static async update(id, storageId, importInfo) {
        let query = `UPDATE importInfo SET Barcode='${importInfo.Barcode}', ImportPrice='${importInfo.ImportPrice}', Amount='${importInfo.Amount}' WHERE Id='${id}' AND storageId='${storageId}'`;
        return await connection.queryDB(query);
    }

    static async delete(id, storageId) {
        let query = `DELETE FROM importInfo WHERE Id='${id}' AND storageId='${storageId}'`;
        return await connection.queryDB(query);
    }

    /**
     * Thêm một bản ghi thông tin xuất hàng vào cơ sở dữ liệu
     * @param {uuid} importId Mã xuất hàng
     * @param {IImportInfo} importInfo Thông tin hàng xuất
     * @returns Số dòng được thêm vào
     */
    static async insertSingleImportInfo(importId, storageId, importInfo) {
        let query = `INSERT INTO importInfo (Id, ObjectId, ImportId, Barcode, Amount, ImportPrice, storageId) VALUES ("${uuidv4()}", '${importInfo.ObjectId}', '${importId}', '${importInfo.Barcode}', ${importInfo.Amount}, ${importInfo.ImportPrice}, '${storageId}')`;
        return await connection.queryDB(query);
    }

    /**
     * Thêm một danh sách các thông tin xuất hàng
     * @param {uuid} importId Mã xuất hàng
     * @param {List<IImportInfo>} importInfoList Danh sách thông tin hàng xuất
     * @returns Mảng kết quả thực hiện thêm
     */
    static async insertImportInfoList(importId, storageId, importInfoList) {
        const promises = importInfoList.map(importInfo => IImportInfo.insertSingleImportInfo(importId, storageId, importInfo))
        return await Promise.allSettled(promises);
    }

    static async getImportAmount(importInfoId, storageId) {
        let query = `SELECT Amount FROM importInfo WHERE Id='${importInfoId}' AND storageId='${storageId}'`;
        let result = await connection.queryDB(query);
        return result[0].Amount;
    }

    static async getImportId(importInfoId, storageId) {
        let query = `SELECT ImportId FROM ImportInfo WHERE Id='${importInfoId}' AND storageId='${storageId}'`;
        let result = await connection.queryDB(query);
        return result[0].ImportId;
    }

    static async getObjectId(importInfoId, storageId) {
        let query = `SELECT ObjectId FROM ImportInfo WHERE Id='${importInfoId}' AND storageId='${storageId}'`;
        let result = await connection.queryDB(query);
        return result[0].ObjectId;
    }

    static async checkLastImportInfoAndDelete(importId, storageId) {
        let query = `SELECT * FROM ImportInfo WHERE ImportId='${importId}' AND storageId='${storageId}'`;
        let result = await connection.queryDB(query);
        if (result.length < 1) {
            let deleteQuery = `DELETE FROM Import WHERE Id='${importId}' AND storageId='${storageId}'`;
            let result = await connection.queryDB(deleteQuery);
        }
    }
}

module.exports = IImportInfo;