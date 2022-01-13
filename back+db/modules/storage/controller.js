const IStorage = require('./model');

module.exports = {
    /**
     * Get storage list
     * @param {Request} req Request from client
     * @param {Response} res Response to client
     */
    getAll: async (req, res) => {
        try {
            let result = await IStorage.getAll();
            res.status(200).send(result);
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    },
    /**
     * Get list of storages associated with user
     * @param {Request} req Request from client
     * @param {Response} res Response to client
     */
    getListByUserId: async (req, res) => {
        try {
            let result = await IStorage.getListByUserId(req.session.Id);
            res.status(200).send(result);
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    },
    /**
     * Get a storage's details
     * @param {Request} req Request from client
     * @param {Response} res Response to client
     */
    getDetailById: async (req, res) => {
        try {
            let result = await IStorage.getDetailById(req.params.id);
            if (result == null) {
                res.status(400).send("Nhà kho không tồn tại");
            } else {
                res.status(200).send(result);
            }
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    },
    insert: async (req, res) => {
        try {
            let result = await IStorage.insert(req.body.DisplayName.trim(), req.body.Address.trim());
            if (result.affectedRows < 1) {
                res.status(200).send("Không thể thêm kho hàng");
            } else {
                res.status(201).send("Thêm kho hàng thành công");
            }
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    },
    update: async (req, res) => {
        try {
            let result = await IStorage.update(req.body.DisplayName, req.body.Address, req.params.id);
            if (result.affectedRows < 1) {
                res.status(200).send("Không thể sửa thông tin kho hàng");
            } else {
                res.status(201).send("Sửa thông tin kho hàng thành công");
            }
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    },
    delete: async (req, res) => {
        try {
            let result = await IStorage.delete(req.params.id);
            if (result.affectedRows < 1) {
                res.status(200).send("Xóa thất bại");
            } else {
                res.status(201).send("Xóa thành công");
            }
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    },
    getNonStorageManager: async (req, res) => {
        try {
            let result = await IStorage.getNonStorageManager(req.params.id);
            res.status(200).send(result);
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    },
    addUserIntoStorage: async (req, res) => {
        try {
            let result = await IStorage.addUserIntoStorage(req.params.userId, req.params.storageId);
            if (result.affectedRows < 1) {
                res.status(200).send("Thêm không thành công");
            } else res.status(201).send("Thêm thành công");
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    },
    removeUserFromStorage: async (req, res) => {
        try {
            let result = await IStorage.removeUserFromStorage(req.params.userId, req.params.storageId);
            if (result.affectedRows < 1) {
                res.status(200).send("Xóa không thành công");
            } else res.status(201).send("Xóa thành công");
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    },
    search: async (req, res) => {
        try {
            let result = await IStorage.search(req.query.filter);
            res.status(200).send(result);
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    }
}