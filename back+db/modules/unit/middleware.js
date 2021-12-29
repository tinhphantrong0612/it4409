const Unit = require('./model');

module.exports = {
    emptyValidate: (req, res, next) => {
        if (req.body.DisplayName.trim()) next();
        else res.status(400).send("Thiếu trường thông tin");
    },
    duplicateValidate: async (req, res, next) => {
        const duplicateList = await Unit.findByName(req.body.DisplayName.toUpperCase());
        if (duplicateList.length !== 0) {
            res.status(400).send("Lặp đơn vị");
        } else next();
    }
}