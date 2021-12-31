const exportController = require('../../modules/export/controller');
const exportRouter = require('express').Router();
const exportValidate = require('../../modules/export/middleware');

exportRouter
    .get('/', exportController.getAll)
    .get('/:id', exportController.getById)
    .post('/', exportValidate.emptyValidate, exportController.post)
    .put('/:id', exportValidate.emptyValidate, exportController.put)
    .delete('/:id', exportController.delete);

module.exports = exportRouter;