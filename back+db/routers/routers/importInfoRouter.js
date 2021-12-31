const importInfoController = require('../../modules/importInfo/controller');
const importInfoRouter = require('express').Router();
const importInfoValidate = require('../../modules/importInfo/middleware');

importInfoRouter
    .get('/', importInfoController.getAll)
    .get('/:id', importInfoController.getById)
    .put('/:id', importInfoValidate.emptyValidate, importInfoValidate.amountValidate, importInfoController.put)
    .delete('/:id', importInfoController.delete);

module.exports = importInfoRouter;