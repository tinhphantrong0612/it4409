const globalMiddleware = require('../../middlewares/globalMiddleware');
const customerController = require('../../modules/customer/controller');
const customerRouter = require('express').Router();
const customerValidate = require('../../modules/customer/middleware')

customerRouter
    .get('/', customerController.getAll)
    .get('/search', globalMiddleware.pagingFilter, customerController.search)
    .get('/:id', customerController.getById)
    .post('/', customerValidate.emptyValidate, customerValidate.duplicateValidate, customerController.post)
    .put('/:id', customerValidate.emptyValidate, customerValidate.duplicateValidate,customerController.put)
    .delete('/:id', customerValidate.usedValidate, customerController.delete);

module.exports = customerRouter;