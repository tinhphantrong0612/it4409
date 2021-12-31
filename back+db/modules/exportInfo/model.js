const connection = require('../databaseConnection');
const config = require('../../config');
const { v4: uuidv4 } = require('uuid');

class IExportInfo {

    /**
     * Trả về danh sách Export Info + ExportDate + CustomerName
     * @returns {List<IExportInfo>}
     */
    static async getAll() {
        let query = `SELECT exportInfo.amount,
                            exportInfo.exportPrice,
                            object.DisplayName as ObjectName,
                            export.exportDate as ExportDate,
                            customer.DisplayName as CustomerName,
                            unit.DisplayName as UnitName
                    FROM exportInfo
                        INNER JOIN object ON object.Id=exportInfo.ObjectId
                        INNER JOIN export ON exportInfo.exportId=export.Id
                        INNER JOIN customer ON export.CustomerId=customer.Id
                        INNER JOIN unit ON unit.Id=object.unitId`;
        return await connection.queryDB(query);
    }

    static async getById(id) {
        let query = `SELECT exportInfo.Amount,
                            exportInfo.ExportPrice,
                            object.DisplayName as ObjectName,
                            export.exportDate as ExportDate,
                            customer.DisplayName as CustomerName,
                            unit.DisplayName as UnitName
                    FROM exportInfo
                        INNER JOIN object ON object.Id=exportInfo.ObjectId
                        INNER JOIN export ON exportInfo.exportId=export.Id
                        INNER JOIN customer ON export.CustomerId=customer.Id
                        INNER JOIN unit ON unit.Id=object.unitId
                    WHERE exportInfo.Id='${id}'`;
        return await connection.queryDB(query);
    }

    /**
     * Get total amout of object and price
     * @param {uuid} objectId
     */
    static async getTotalObjectAmoutAndPrice(objectId) {
        let query = `SELECT ExportPrice, Amount FROM exportInfo WHERE objectId = '${objectId}'`;
        let result = {
            Amount: 0,
            ExportMoney: 0
        }
        let queryResult = await connection.queryDB(query);
        for (const singleExport of queryResult) {
            result.Amount += singleExport.Amount;
            result.ExportMoney += singleExport.ExportPrice * singleExport.Amount;
        }
        return result;
    }

    /**
     * Thêm một bản ghi thông tin xuất hàng vào cơ sở dữ liệu
     * @param {uuid} exportId Mã xuất hàng
     * @param {IExportInfo} exportInfo Thông tin hàng xuất
     * @returns Số dòng được thêm vào
     */
    static async insertSingleExportInfo(exportId, exportInfo) {
        let query = `INSERT INTO exportInfo (Id, ObjectId, ExportId, Amount, ExportPrice) VALUES ("${uuidv4()}", '${exportInfo.ObjectId}', '${exportId}', ${exportInfo.Amount}, ${exportInfo.ExportPrice})`;
        return await connection.queryDB(query);
    }

    /**
     * Thêm một danh sách các thông tin xuất hàng
     * @param {uuid} exportId Mã xuất hàng
     * @param {List<IExportInfo>} exportInfoList Danh sách thông tin hàng xuất
     * @returns Mảng kết quả thực hiện thêm
     */
    static async insertExportInfoList(exportId, exportInfoList) {
        const promises = exportInfoList.map(exportInfo => IExportInfo.insertSingleExportInfo(exportId, exportInfo))
        return await Promise.allSettled(promises);
    }

    /**
     * Cập nhật thông tin xuất hàng  
     * @param {uuid} exportInfoId Mã xuất hàng
     * @param {IExportInfo} exportInfo Thông tin xuất hàng
     * @returns Số dòng bị ảnh hưởng
     */
    static async update(exportInfoId, exportInfo) {
        let query = `UPDATE exportInfo
                        SET Amount = ${exportInfo.Amount}, ExportPrice = ${exportInfo.ExportPrice}
                        WHERE Id='${exportInfoId}'`;
        return await connection.queryDB(query);
    }

    /**
     * Cập nhật thông tin xuất hàng  
     * @param {uuid} exportInfoId Mã xuất hàng
     * @returns Số dòng bị ảnh hưởng
     */
    static async delete(exportInfoId) {
        let query = `DELETE FROM exportInfo WHERE Id='${exportInfoId}'`;
        return await connection.queryDB(query);
    }

    /**
     * Trả về số lượng đã xuất ra của một mặt hàng
     * @param {uuid} objectId Id của object xuất ra
     * @returns Tổng số object đã xuất kho
     */
    static async getTotalExportAmount(objectId) {
        let query = `SELECT Amount FROM exportInfo WHERE objectId='${objectId}'`;
        const result = await connection.queryDB(query);
        result.unshift(0);
        return result.reduce((a, b) => a + b.Amount);
    }

    static async getExportAmount(id) {
        let query = `SELECT Amount FROM exportInfo WHERE Id='${id}'`;
        const result = await connection.queryDB(query);
        if (result.length == 0) return 0;
        else return result[0].Amount;
    }

    static async getExportId(exportInfoId) {
        let query = `SELECT ExportId FROM ExportInfo WHERE Id='${exportInfoId}'`;
        let result = await connection.queryDB(query);
        return result[0].ExportId;
    }

    static async checkLastExportInfoAndDelete(exportId) {
        let query = `SELECT * FROM ExportInfo WHERE ExportId='${exportId}'`;
        let result = await connection.queryDB(query);
        if (result.length < 1) {
            let deleteQuery = `DELETE FROM Export WHERE Id='${exportId}'`;
            await connection.queryDB(deleteQuery);
        }
    }
}

module.exports = IExportInfo;