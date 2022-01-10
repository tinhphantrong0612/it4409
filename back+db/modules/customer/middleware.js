const Customer = require('./model');

module.exports = {
    emptyValidate: (req, res, next) => {
        if (!req.body || !req.body.displayName ||
        !req.body.address ||
        !req.body.phone ||
        !req.body.email) res.status(400).send("Thiếu trường thông tin");
        else next();
    },
    duplicateValidate: async (req, res, next) => {
        const duplicateList = await Customer.findByInfo(req.body.displayName, req.body.address, req.body.phone, req.body.email, req.session.storageId);
        if (duplicateList.length !== 0) {
            res.status(400).send("Lặp đơn vị");
        } else next();
    },
    usedValidate: async (req, res, next) => {
        const isUsed = await Customer.isCustomerIdUsed(req.params.id, req.session.storageId);
        if (isUsed) res.status(400).send("Một số đơn xuất hàng đang dùng thông tin này");
        else next();
    }
}