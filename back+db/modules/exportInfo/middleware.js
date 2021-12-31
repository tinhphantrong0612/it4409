const IImportInfo = require('../importInfo/model');
const IExportInfo = require('./model');

module.exports = {
    emptyValidate: (req, res, next) => {
        if (!req.body ||
            !req.body.ObjectId ||
            !req.body.ObjectId.trim() ||
            isNaN(req.body.ExportPrice) ||
            req.body.ExportPrice < 0 ||
            isNaN(req.body.Amount) ||
            req.body.Amount <= 0) {
            res.status(400).send("Thiếu trường thông tin");
        } else next();
    },
    amountValidate: async (req, res, next) => {
        try {
            const [totalExportAmount, totalImportAmount, exportAmount] = await Promise.all([IExportInfo.getTotalExportAmount(req.body.ObjectId), IImportInfo.getTotalImportAmount(req.body.ObjectId), IImportInfo.getImportAmount(req.params.id)]);
            if (totalImportAmount >= totalExportAmount - exportAmount + req.body.Amount) next();
            else res.status(400).send("Số lượng xuất ra không hợp lệ, tổng xuất lớn hơn tổng nhập");
        } catch (error) {
            console.log(error);
            res.status(400).send("Thông tin không hợp lệ");
        }
    }
}