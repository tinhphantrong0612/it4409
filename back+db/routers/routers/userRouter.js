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

module.exports = userRouter;