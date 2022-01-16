const IExportInfo = require('../exportInfo/model');
const IImport = require('../import/model');
const IImportInfo = require('./model');

module.exports = {
    emptyValidate: (req, res, next) => {
        if (!req.body ||
            !/^\d+$/.test(req.body.Barcode) ||
            isNaN(req.body.ImportPrice) ||
            req.body.ImportPrice < 0 || !req.body.ObjectId
        ) {
            res.status(400).send("Thiếu trường thông tin");
        } else if (isNaN(req.body.Amount) || req.body.Amount <= 0) res.status(400).send("Số lượng nhập không hợp lệ")
        else next();
    },
    amountValidate: async (req, res, next) => {
        try {
            const [totalExportAmount, totalImportAmount, importAmount] = await Promise.all([
                IExportInfo.getTotalExportAmount(req.body.ObjectId, req.session.StorageId),
                IImportInfo.getTotalImportAmount(req.body.ObjectId, req.session.StorageId),
                IImportInfo.getImportAmount(req.params.id, req.session.StorageId)]
            );
            if (totalImportAmount - importAmount + req.body.Amount >= totalExportAmount) next();
            else res.status(400).send("Số lượng thay đổi không hợp lệ, tổng xuất lớn hơn tổng nhập");
        } catch (error) {
            console.log(error);
            res.status(400).send("Thông tin không hợp lệ");
        }
    },
    deleteAmountValidate: async (req, res, next) => {
        try {
            let ObjectId = await IImportInfo.getObjectId(req.params.id, req.session.StorageId);
            const [totalExportAmount, totalImportAmount, importAmount] = await Promise.all([IExportInfo.getTotalExportAmount(ObjectId, req.session.StorageId), IImportInfo.getTotalImportAmount(ObjectId, req.session.StorageId), IImportInfo.getImportAmount(req.params.id, req.session.StorageId)]);
            if (totalImportAmount - importAmount >= totalExportAmount) next();
            else res.status(400).send("Không thể xóa, do số lượng hàng xuất sẽ vượt số hàng nhập");
        } catch (error) {
            console.log(error);
            res.status(400).send("Thông tin không hợp lệ");
        }
    }
}