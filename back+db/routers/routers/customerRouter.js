const customerController = require('../../modules/customer/controller');
const customerRouter = require('express').Router();

customerRouter
    .get('/', customerController.getAll)
    .get('/:id', customerController.getById)
    .post('/', customerController.post)
    .put('/:id', customerController.put)
    .delete('/:id', customerController.delete);

module.exports = customerRouter;