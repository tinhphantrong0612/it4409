const IExport = require("./model");

module.exports = {
    emptyValidate: (req, res, next) => {
        if (!req.body || !req.body.CustomerId || !req.body.ExportInfoList || req.body.ExportInfoList.length == 0)
            res.status(400).send("Thiếu thông tin");
        else if (req.body.ExportInfoList.length > 5) {
            res.status(400).send("Nhập tối đa 5 mặt hàng mỗi đơn");
        } else {
            let isValid = true;
            for (const exportInfo of req.body.ExportInfoList) {
                if (!exportInfo.ObjectId || isNaN(exportInfo.ExportPrice) || exportInfo.ExportPrice < 0 || !exportInfo.Amount || isNaN(exportInfo.Amount) || exportInfo.Amount <= 0) {
                    isValid = false;
                    break;
                }
            }
            if (isValid) next();
            else res.status(400).send("Các trường thông tin không hợp lệ");
        }
    },
    customerValidate: async (req, res, next) => {
        let isCustomerExist = await IExport.isCustomerExist(req.body.CustomerId, req.session.StorageId);
        if (isCustomerExist) next();
        else res.status(400).send("Khách hàng không tồn tại");
    },
    objectValidate: async (req, res, next) => {
        objectIdList = req.body.ExportInfoList.map(obj => obj.ObjectId);
        let result = await IExport.isMultipleObjectsCoexist(objectIdList, req.session.StorageId);
        if (result) next();
        else res.status(400).send("Mặt hàng không tồn tại");
    },
    isAllExportAmountValid: async (req, res, next) => {
        let objectList = req.body.ExportInfoList.map(obj => {
            return {
                objectId: obj.ObjectId,
                amount: obj.Amount
            }
        });
        let packedObjectList = [];
        // trường hợp xuất cùng loại mặt hàng nhiều lần
        objectList.forEach(obj => {
            let isDuplicate = false;
            for (const packedObj of packedObjectList) {
                if (packedObj.objectId == obj.objectId) {
                    packedObj.amount = Number(packedObj.amount) + Number(obj.amount);
                    isDuplicate = true;
                    break;
                }
            }
            if (!isDuplicate) packedObjectList.push(obj);
        });
        let result = await IExport.isAllExportAmountValid(packedObjectList, req.session.StorageId);
        if (result) next();
        else res.status(400).send("Số lượng mặt hàng không đủ để xuất ra");
    },
}