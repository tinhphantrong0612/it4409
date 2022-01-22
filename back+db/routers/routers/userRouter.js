const userRouter = require('express').Router();
const userController = require('../../modules/user/controller');
const userValidate = require('../../modules/user/middleware');
const globalMiddleware = require('../../middlewares/globalMiddleware');
const { role } = require('../../enum/enum');
userRouter
    .get('/',
        userValidate.isAdminValidate,
        userController.getAll
    )
    .get('/search',
        globalMiddleware.pagingFilter, 
        userValidate.isAdminValidate, 
        userController.getSearchResult
    )
    .get('/login', (req, res) => {
        if (req.session.Id) {
            res.status(200).send(JSON.stringify({
                Role: req.session.Role,
                DisplayName: req.session.DisplayName,
            }));
        } else {
            res.status(400).send("Người dùng chưa đăng nhập")
        }
    })
    .get('/logout', userController.logout)
    .get('/setAdmin/:id', userValidate.isAdminValidate, userValidate.isValidToBecomeAdmin, userController.setAdmin)
    .get('/nonstorage/:id', userValidate.isAdminValidate, userController.getNonAssignStorage)
    .get('/:id',
        userValidate.isAdminValidate, // Only admin allow
        userController.getById
    )
    .post('/login',
        userValidate.emptyValidate, // Check empty body
        userController.login
    )
    .post('/register',
        userValidate.emptyValidate, // Check empty body
        userValidate.registerEmptyValidate, // Check register info
        (req, res) => {
            if (req.session.Role == role.admin) userController.registerAdmin(req, res);
            else userController.register(req, res);
        }
    )
    .post('/storageid',
        userValidate.loggedInValidate,
        userValidate.storageValidate,
        userController.setStorageId
    );

module.exports = userRouter;