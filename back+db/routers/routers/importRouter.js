const importController = require('../../modules/import/controller');
const importRouter = require('express').Router();
const importValidate = require('../../modules/import/middleware');

importRouter
    .get('/', importController.getAll)
    .get('/:id', importController.getById)
    .post('/',
        importValidate.emptyValidate,
        importValidate.supplierValidate,
        importValidate.objectValidate,
        importController.post)
    .put('/:id',
        importValidate.emptyValidate,
        importValidate.supplierValidate,
        importValidate.objectValidate,
        importController.put)
    .delete('/:id', importController.delete);

module.exports = importRouter;