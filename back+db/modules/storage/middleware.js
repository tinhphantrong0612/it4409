const IStorage = require('./model');

module.exports = {
    emptyValidate: (req, res, next) => {
        if (!req.body || !req.body.DisplayName || !req.body.Address) {
            res.status(400).send("Thiếu trường thông tin");
        } else next();
    },
    duplicateValidate: async (req, res, next) => {
        let isDuplicate = await IStorage.checkNameDuplicate(req.body.DisplayName);
        if (isDuplicate) {
            res.status(400).send("Tên kho hàng đã tồn tại");
        } else next();
    },
    updateEmptyValidate: (req, res, next) => {
        if (!req.body.StorageId) res.status(400).send("Thiếu trường thông tin");
        else next();
    },
    updateDuplicateValidate: async (req, res, next) => {
        let isDuplicate = await IStorage.checkNameDuplicate(req.body.DisplayName, req.body.StorageId);
        if (isDuplicate) {
            res.status(400).send("Tên kho hàng mới trùng với tên kho hàng khác");
        } else next();
    },
    /**
     * Check if storage is empty
     * @param {Request} req Request from client
     * @param {Response} res Response to client
     * @param {Function} next Next middleware function
     */
    emptyStorageValidate: async(req, res, next) => {
        try {
            await IStorage.checkEmptyStorage(req.params.id);
            next();
        } catch (error) {
            console.log(error);
            res.status(400).send(error);
        }
    }
}