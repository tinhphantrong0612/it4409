const Unit = require('./model');

module.exports = {
    emptyValidate: (req, res, next) => {
        if (!req.body || !req.body.DisplayName || !req.body.DisplayName.trim()) res.status(400).send("Thiếu trường thông tin");
        else next();
    },
    duplicateValidate: async (req, res, next) => {
        const duplicateList = await Unit.findByName(req.body.DisplayName.toUpperCase(), req.session.storageId);
        if (duplicateList.length !== 0) {
            res.status(400).send("Lặp đơn vị");
        } else next();
    },
    usedValidate: async (req, res, next) => {
        const isUsed = await Unit.isUnitIdUsed(req.params.id, req.session.storageId);
        if (isUsed) res.status(400).send("Một số mặt hàng đang sử dụng đơn vị này");
        else next();
    }
}