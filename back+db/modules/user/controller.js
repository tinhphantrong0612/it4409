const path = require('path');
const { role } = require('../../enum/enum');
const User = require('./model');

module.exports = {
    getAll: async (req, res) => {
        try {
            let result = await User.getAll();
            res.status(200).send(result);
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error")
        }
    },
    /**
     * Lấy thông tin người dùng qua Id
     * @param {Request} req Request từ người dùng
     * @param {Response} res Response của server
     */
    getById: async (req, res) => {
        try {
            let user = await User.getOneById(req.params.id);
            if (user == null) res.stutus(400).send("Không tìm thấy người dùng yêu cầu");
            else res.status(200).send(user);
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error")
        }
    },
    /**
     * Kiểm tra thông tin đăng nhập của người dùng
     * @param {Request} req Request từ người dùng
     * @param {Response} res Response của server
     */
    login: async (req, res) => {
        let user = await User.authenticate(req.body.username, req.body.password);
        if (user !== null) {
            req.session.Id = user.Id;
            req.session.Role = user.Role;
            req.session.DisplayName = user.DisplayName;
            res.status(200).send(user);
        } else {
            res.status(400).send("Thông tin đăng nhập không chính xác");
        }
    },
    /**
     * Đăng ký người dùng mới
     * @param {Request} req Request từ client
     * @param {Response} res Phản hồi của Server
     */
    register: async (req, res) => {
        // Kiểm tra người dùng đã tồn tại
        let user = await User.findOneByUsername(req.body.username);
        if (user == null) { // Nếu chưa
            // Thêm người dùng
            let result = await User.addUser(req.body.username, req.body.password, req.body.displayName);
            if (result.affectedRows < 1) { // Thêm thất bại
                res.status(200).send("Có lỗi xảy ra, không thể thêm người dùng");
            } else {  // Thêm thành công
                res.status(201).send("Đăng ký thành công");
            }
        } else { // Người dùng đã tồn tại
            res.status(400).send("Người dùng đã tồn tại");
        }
    },

    registerAdmin: async (req, res) => {
        // Kiểm tra người dùng đã tồn tại
        let user = await User.findOneByUsername(req.body.username);
        if (user == null) { // Nếu chưa
            // Thêm người dùng
            let result = await User.addAdmin(req.body.username, req.body.password, req.body.displayName);
            if (result.affectedRows < 1) { // Thêm thất bại
                res.status(200).send("Có lỗi xảy ra, không thể thêm người dùng");
            } else {  // Thêm thành công
                res.status(201).send("Đăng ký thành công");
            }
        } else { // Người dùng đã tồn tại
            res.status(400).send("Người dùng đã tồn tại");
        }
    },

    setAdmin: async (req, res) => {
        try {
            let result = await User.setAdmin(req.params.id);
            if (result.affectedRows < 1) {
                res.status(200).send("Giao quyền quản trị không thành công");
            } else {
                res.status(201).send("Giao quyền quản trị thành công");
            }
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    },

    logout: async (req, res) => {
        // delete user session
        if (req.app.userSubscriber) delete req.app.userSubscriber[req.session.Id];
        if (req.app.adminSubscriber) delete req.app.adminSubscriber[req.session.Id];
        delete req.session.Id;
        delete req.session.StorageId;
        delete req.session.Role;

        res.status(200).send("Ok");
    },
    setStorageId: (req, res) => {
        if (!req.body || !req.body.storageId) {
            res.status(400).send("Thiếu thông tin");
        } else {
            req.session.StorageId = req.body.storageId;
            res.status(200).send("Thành công");
        }
    },
    /**
     * Set user as admin        
     * @param {*} req 
     * @param {*} res 
     */
    setAdmin: async (req, res) => {
        try {
            let result = await User.setAdmin(req.params.id);
            if (result.affectedRows < 1) {
                res.status(200).send("Cấp quyền quản trị viên không thành công");
            } else res.status(201).send("Cấp quyền quản trị viên thành công");
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error")
        }
    },
    getNonAssignStorage: async(req, res) => {
        try {
            let result = await User.getNonAssignStorage(req.params.id);
            res.status(200).send(result);
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    },
    getSearchResult: async (req, res) => {
        try {
            let result = await User.searchByNameWithPaging(req.query.filter, req.query.pageNumber, req.query.pageSize);
            res.status(200).send(result);
        } catch(error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    }
}