const userRouter = require('express').Router();
const userController = require('../../modules/user/controller');
const userValidate = require('../../modules/user/middleware');

userRouter
    .get('/:id',
        userValidate.adminValidate, // Only admin allow
        userController.getById)
    .post('/login',
        userValidate.emptyValidate, // Check empty body
        userController.login)
    .post('/register',
        userValidate.emptyValidate, // Check empty body
        userValidate.registerEmptyValidate, // Check register info
        userController.register)
    .get('/login', (req, res) => {
        if (req.session.Id && req.session.Role) {
            res.status(200).send(`${req.session.Role}`);
        } else {
            res.status(400).send("Người dùng chưa đăng nhập")
        }
    })

module.exports = userRouter;