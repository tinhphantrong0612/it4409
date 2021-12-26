const objectController = require('../../modules/object/controller');
const objectRouter = require('express').Router();

objectRouter
    .get('/', objectController.getAll)
    .get('/:id', objectController.getById)
    .post('/', objectController.post)
    .put('/:id', objectController.put)
    .delete('/:id', objectController.delete);

module.exports = objectRouter;