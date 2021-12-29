const objectController = require('../../modules/object/controller');
const objectRouter = require('express').Router();
const objectValidate = require('../../modules/object/middleware');

objectRouter
    .get('/', objectController.getAll)
    .get('/:id', objectController.getById)
    .post('/', objectValidate.emptyValidate, objectValidate.duplicateValidate, objectValidate.nonExistUnitIdValidate, objectController.post)
    .put('/:id', objectValidate.emptyValidate, objectValidate.duplicateValidate, objectValidate.nonExistUnitIdValidate, objectController.put)
    .delete('/:id', objectController.delete);

module.exports = objectRouter;