const role = require('../../enum/role');
const storageController = require('../../modules/storage/controller');
const storageRouter = require('express').Router();
const storageValidate = require('../../modules/storage/middleware');
const userValidate = require('../../modules/user/middleware');


storageRouter
    .get('/', (req, res) => {
        if (req.session.Role == role.admin) {
            storageController.getAll(req, res);
        } else if (req.session.Role == role.user) {
            storageController.getListByUserId(req, res);
        } else {
            res.status(500).send("Internal Server Error");
        }
    })
    .get('/:id', storageController.getDetailById)
    .post('/',
        userValidate.adminValidate, // Must be admin
        storageValidate.emptyValidate, // Not empty
        storageValidate.duplicateValidate, // Not duplicated name
        storageController.insert
    )
    .put('/:id',
        userValidate.adminValidate, // Must be admin
        storageValidate.emptyValidate, // Not empty
        storageValidate.updateDuplicateValidate, // Not duplicate update ver
        storageController.update
    ).delete('/:id',
        userValidate.adminValidate, // Must be admin
        storageValidate.emptyStorageValidate, // Storage is completely empty
        storageController.delete
    ).get('/nonuser/:id',
        userValidate.adminValidate,
        storageController.getNonStorageManager
    ).post('/user/:id',
        userValidate.adminValidate,
        storageValidate.addUserEmptyValidate,
        storageValidate.storageExistForAdminValidate,
        storageController.addUserIntoStorage
    )

module.exports = storageRouter;