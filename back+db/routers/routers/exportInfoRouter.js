const exportInfoController = require('../../modules/exportInfo/controller');
const exportInfoRouter = require('express').Router();
const exportInfoValidate = require('../../modules/exportInfo/middleware');

exportInfoRouter
    .get('/', exportInfoController.getAll)
    .get('/:id', exportInfoController.getById)
    .put('/:id', exportInfoValidate.emptyValidate, exportInfoValidate.amountValidate, exportInfoController.put)
    .delete('/:id', exportInfoController.delete);

module.exports = exportInfoRouter;