const unitController = require('../../modules/unit/controller');
const unitRouter = require('express').Router();
const unitValidate = require('../../modules/unit/middleware');

unitRouter
    .get('/', unitController.getAll)
    .get('/:id', unitController.getById)
    .post('/', unitValidate.emptyValidate, unitValidate.duplicateValidate, unitController.post)
    .put('/:id', unitValidate.emptyValidate, unitValidate.duplicateValidate, unitController.put)
    .delete('/:id', unitValidate.usedValidate, unitController.delete);

module.exports = unitRouter;