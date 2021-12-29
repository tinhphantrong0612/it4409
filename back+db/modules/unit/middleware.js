const Unit = require('./model');

module.exports = {
    emptyValidate: (req, res, next) => {
        if (!req.body || !req.body.DisplayName || !req.body.DisplayName.trim()) res.status(400).send("Thiếu trường thông tin");
        else next();
    },
    duplicateValidate: async (req, res, next) => {
        const duplicateList = await Unit.findByName(req.body.DisplayName.toUpperCase());
        if (duplicateList.length !== 0) {
            res.status(400).send("Lặp đơn vị");
        } else next();
    }
}