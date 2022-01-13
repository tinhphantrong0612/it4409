const supplierController = require('../../modules/supplier/controller');
const supplierRouter = require('express').Router();
const supplierValidate = require('../../modules/supplier/middleware')

supplierRouter
    .get('/', supplierController.getAll)
    .get('/:id', supplierController.getById)
    .get('/search/:key&:term', supplierController.getSearchResult)
    .post('/', supplierValidate.emptyValidate, supplierValidate.duplicateValidate, supplierController.post)
    .put('/:id', supplierValidate.emptyValidate, supplierValidate.duplicateValidate, supplierController.put)
    .delete('/:id', supplierValidate.usedValidate, supplierController.delete);

module.exports = supplierRouter;