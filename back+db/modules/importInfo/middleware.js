const IExportInfo = require('../exportInfo/model');
const IImportInfo = require('./model');

module.exports = {
    emptyValidate: (req, res, next) => {
        if (!req.body ||
            !req.body.ObjectId || !req.body.ObjectId.trim() ||
            !req.body.ImportPrice || !req.body.Barcode || !req.body.Amount) {
            res.status(400).send("Thiếu trường thông tin");
        } else next();
    },
    amountValidate: async (req, res, next) => {
        try {
            const [totalExportAmount, totalImportAmount, importAmount] = await Promise.all([IExportInfo.getTotalExportAmount(req.body.ObjectId), IImportInfo.getTotalImportAmount(req.body.ObjectId), IExportInfo.getExportAmount(req.params.id)]);
            if (totalImportAmount - importAmount + req.body.Amount >= totalExportAmount) next();
            else res.status(400).send("Số lượng nhập sửa đổi không hợp lệ, tổng xuất lớn hơn tổng nhập");
        } catch (error) {
            console.log(error);
            res.status(400).send("Thông tin không hợp lệ");
        }
    }
}