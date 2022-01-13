const role = require('../../enum/enum').role;

module.exports = {
    emptyValidate: (req, res, next) => {
        if (!req.body || !req.body.username || !req.body.password) {
            res.status(400).send("Tên đăng nhập và mật khẩu không hợp lệ");
        } else next();
    },
    registerEmptyValidate: (req, res, next) => {
        if (!req.body.displayName) {
            res.status(400).send("Tên người dùng không được phép bỏ trống");
        } else next();
    },
    /**
     * Block user who did't log in
     * @param {Request} req Request
     * @param {Response} res Response
     * @param {Function} next Next function in middleware chain
     */
    loggedInValidate: (req, res, next) => {
        if (!req.session.Id || req.session.Role === undefined || req.session.Role === null) res.status(401).send("Người dùng chưa xác thực danh tính, vui lòng đăng nhập trước khi thực hiện yêu cầu");
        else next();
    },
    
    /**
     * Block user who isn't a admin
     * @param {Request} req Request
     * @param {Response} res Response
     * @param {Function} next Next function in middleware chain
     */
    isAdminValidate: (req, res, next) => {
        if (!req.session.Id || req.session.Role !== role.admin) res.status(401).send("Cần đăng nhập với vai trò quản trị viên.");
        else next();
    },

    isUserValidate: (req, res, next) => {
        if (!req.session.Id || req.session.Role !== role.user) res.status(401).send("Cần đăng nhập với vai trò người dùng");
        else next();
    }
}