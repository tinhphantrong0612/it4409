const supplierController = require('../../modules/supplier/controller');
const supplierRouter = require('express').Router();

supplierRouter
    .get('/', supplierController.getAll)
    .get('/:id', supplierController.getById)
    .post('/', supplierController.post)
    .put('/:id', supplierController.put)
    .delete('/:id', supplierController.delete);

module.exports = supplierRouter;