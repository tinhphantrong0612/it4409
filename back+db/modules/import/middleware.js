const IImport = require("./model");

module.exports = {
    emptyValidate: (req, res, next) => {
        if (!req.body || !req.body.SupplierId || !req.body.ImportInfoList || req.body.ImportInfoList.length == 0)
            res.status(400).send("Thiếu thông tin");
        else if (req.body.ImportInfoList.length > 5) {
            res.status(400).send("Nhập tối đa 5 mặt hàng mỗi đơn");
        } else {
            let isValid = true;
            for (const importInfo of req.body.ImportInfoList) {
                if (!importInfo.ObjectId || !/^\d+$/.test(importInfo.Barcode) || isNaN(importInfo.ImportPrice) || importInfo.ImportPrice < 0 || isNaN(importInfo.Amount) || importInfo.Amount <= 0) {
                    isValid = false;
                    break;
                }
            }
            if (isValid) next();
            else res.status(400).send("Các trường thông tin không hợp lệ");
        }
    },
    supplierValidate: async (req, res, next) => {
        if (!req.body.SupplierId) res.status(400).send("Thông tin nhà cung cấp không hợp lệ");
        else {
            let isSupplierExist = await IImport.isSupplierExist(req.body.SupplierId);
            if (isSupplierExist) next();
            else res.status(400).send("Nhà cung cấp không tồn tại");
        }
    },
    objectValidate: async (req, res, next) => {
        objectIdList = req.body.ImportInfoList.map(obj => obj.ObjectId);
        let result = await IImport.isMultipleObjectsCoexist(objectIdList);
        if (result) next();
        else res.status(400).send("Mặt hàng không tồn tại");
    }
}