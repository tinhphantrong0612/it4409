const globalMiddleware = require('../../middlewares/globalMiddleware');
const exportController = require('../../modules/export/controller');
const exportRouter = require('express').Router();
const exportValidate = require('../../modules/export/middleware');

exportRouter
    .get('/', exportController.getAll)
    .get('/search', globalMiddleware.pagingFilter, exportController.search)
    .get('/:id', exportController.getById)
    .post('/', exportValidate.emptyValidate,
        exportValidate.customerValidate,
        exportValidate.objectValidate,
        exportValidate.isAllExportAmountValid,
        exportController.post)
    .put('/:id',
        exportValidate.customerValidate,
        exportController.put)
// Không cho phép xóa, tự động xóa khi exportInfo cuối cùng bị xóa
// .delete('/:id', exportController.delete);

module.exports = exportRouter;