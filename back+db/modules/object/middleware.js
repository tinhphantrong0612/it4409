const IObject = require('./model');
const Unit = require('../unit/model');

module.exports = {
    emptyValidate: (req, res, next) => {
        if (!req.body.DisplayName.trim() || !req.body.UnitId) {
            res.status(400).send("Thiếu trường thông tin");
        } else next();
    },
    duplicateValidate: async (req, res, next) => {
        const duplicateList = await IObject.findByName(req.body.DisplayName.toUpperCase());
        if (duplicateList.length !== 0) res.status(400).send("Lặp tên mặt hàng");
        else next();
    },
    nonExistUnitIdValidate: async (req, res, next) => {
        const unit = await Unit.getById(req.body.UnitId);
        if (!unit) res.status(400).send("Đơn vị không tồn tại");
        else next();
    }
}