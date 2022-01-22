const IImportInfo = require('../importInfo/model');
const IExportInfo = require('./model');

module.exports = {
    emptyValidate: (req, res, next) => {
        if (!req.body ||
            isNaN(req.body.ExportPrice) ||
            req.body.ExportPrice < 0 || !req.body.ObjectId
        ) {
            res.status(400).send("Thiếu trường thông tin");
        } else if (isNaN(req.body.Amount) || req.body.Amount <= 0) res.status(400).send("Số lượng hàng xuất ra không hợp lệ")
        else next();
    },
    amountValidate: async (req, res, next) => {
        try {
            // Khoong neen tin tuongw object id do nguoi dung gui len
            const objectId = await IExportInfo.getObjectIdFromExportInfoId(req.params.id, req.session.StorageId);
            const [totalExportAmount, totalImportAmount, exportAmount] =
                await Promise.all([IExportInfo.getTotalExportAmount(objectId, req.session.StorageId), // Choox nayf phair la object id day, param la cai exportinfoId
                IImportInfo.getTotalImportAmount(objectId, req.session.StorageId),
                IExportInfo.getExportAmount(req.params.id, req.session.StorageId)]);
            if (Number(totalImportAmount) >= Number(totalExportAmount) - Number(exportAmount) + Number(req.body.Amount)) next();
            else res.status(400).send("Số lượng xuất ra không hợp lệ, tổng xuất lớn hơn tổng nhập");
        } catch (error) {
            console.log(error);
            res.status(400).send(error.message);
        }
    }
}