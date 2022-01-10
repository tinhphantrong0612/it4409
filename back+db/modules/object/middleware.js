const IObject = require('./model');

module.exports = {
    emptyValidate: (req, res, next) => {
        if (!req.body || !req.body.DisplayName || !req.body.DisplayName.trim() || !req.body.UnitId) {
            res.status(400).send("Thiếu trường thông tin");
        } else next();
    },
    duplicateValidate: async (req, res, next) => {
        const duplicateList = await IObject.findByName(req.body.DisplayName.toUpperCase(), req.session.StorageId);
        if (duplicateList.length !== 0) res.status(400).send("Lặp tên mặt hàng");
        else next();
    },
    nonExistUnitIdValidate: async (req, res, next) => {
        const unit = await IObject.isUnitExist(req.body.UnitId, req.session.StorageId);
        if (!unit) res.status(400).send("Đơn vị không tồn tại");
        else next();
    },
    usedValidate: async (req, res, next) => {
        const isImported = await IObject.isImported(req.params.id, req.session.StorageId);
        if (isImported) res.status(400).send("Mặt hàng đã được nhập vào, không thể xóa mặt hàng");
        else next();
    }
}