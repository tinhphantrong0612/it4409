const role = require('../../enum/role').role;
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
    .get('/search', userValidate.isAdminValidate, storageController.search)
    .get('/:id', userValidate.isAdminValidate, storageController.getDetailById)
    .post('/',
        userValidate.isAdminValidate, // Must be admin
        storageValidate.emptyValidate, // Not empty
        storageValidate.duplicateValidate, // Not duplicated name
        storageController.insert
    )
    .put('/:id',
        userValidate.isAdminValidate, // Must be admin
        storageValidate.emptyValidate, // Not empty
        storageValidate.updateDuplicateValidate, // Not duplicate update ver
        storageController.update
    ).delete('/:storageId/user/:userId',
        userValidate.isAdminValidate,
        storageValidate.storageExistForAdminValidate,
        storageController.removeUserFromStorage
    ).delete('/:id',
        userValidate.isAdminValidate, // Must be admin
        storageValidate.emptyStorageValidate, // Storage is completely empty
        storageController.delete
    ).get('/nonuser/:id',
        userValidate.isAdminValidate,
        storageController.getNonStorageManager
    ).post('/:storageId/user/:userId',
        userValidate.isAdminValidate,
        storageValidate.storageExistForAdminValidate,
        storageValidate.userValidate,
        storageController.addUserIntoStorage
    )

module.exports = storageRouter;