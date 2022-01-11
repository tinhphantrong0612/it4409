const IStorage = require('./model');

module.exports = {
    emptyValidate: (req, res, next) => {
        if (!req.body || !req.body.DisplayName || !req.body.Address) {
            res.status(400).send("Thiếu trường thông tin");
        } else next();
    },
    chosenStorageValidate: (req, res, next) => {
        if (!req.session.StorageId) res.status(400).send("Vui lòng chọn kho trước");
        else next();
    },
    duplicateValidate: async (req, res, next) => {
        let isDuplicate = await IStorage.checkNameDuplicate(req.body.DisplayName);
        if (isDuplicate) {
            res.status(400).send("Tên kho hàng đã tồn tại");
        } else next();
    },
    updateDuplicateValidate: async (req, res, next) => {
        let isDuplicate = await IStorage.checkNameDuplicate(req.body.DisplayName, req.params.id);
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
    emptyStorageValidate: async (req, res, next) => {
        try {
            await IStorage.checkEmptyStorage(req.params.id);
            next();
        } catch (error) {
            console.log(error);
            res.status(400).send(error);
        }
    },
    userValidate: async (req, res, next) => {
        let result = await IStorage.isUserValid(req.params.userId, req.params.storageId);
        if (result === true) next();
        else res.status(400).send("Người dùng đã là quản lý kho");
    },
    storageExistForUserValidate: async (req, res, next) => {
        let isExist = await IStorage.isStorageExist(req.session.StorageId);
        if (isExist) next();
        else res.status(400).send("Kho không tồn tại");
    },
    storageExistForAdminValidate: async (req, res, next) => {
        let isExist = await IStorage.isStorageExist(req.params.storageId);
        if (isExist) next();
        else res.status(400).send("Kho hàng không tồn tại");
    }
}