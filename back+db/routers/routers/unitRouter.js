const unitController = require('../../modules/unit/controller');
const unitRouter = require('express').Router();

unitRouter
    .get('/', unitController.getAll)
    .get('/:id', unitController.getById)
    .post('/', unitController.post)
    .put('/:id', unitController.put)
    .delete('/:id', unitController.delete);

module.exports = unitRouter;