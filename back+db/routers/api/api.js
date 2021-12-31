const express = require('express');
const api = express.Router();
const authorizeMiddleware = require('../../middlewares/authorizeMiddleware');
const unitRouter = require('../routers/unitRouter');
const objectRouter = require('../routers/objectRouter');
const customerRouter = require('../routers/customerRouter');
const supplierRouter = require('../routers/supplierRouter');
const exportRouter = require('../routers/exportRouter');
const importRouter = require('../routers/importRouter');
const importInfoRouter = require('../routers/importInfoRouter');
const exportInfoRouter = require('../routers/exportInfoRouter');

api.use('/unit', unitRouter)
    .use('/object', objectRouter)
    .use('/customer', customerRouter)
    .use('/supplier', supplierRouter)
    .use('/export', exportRouter)
    .use('/import', importRouter)
    .use('/importInfo', importInfoRouter)
    .use('/exportInfo', exportInfoRouter)

module.exports = api;