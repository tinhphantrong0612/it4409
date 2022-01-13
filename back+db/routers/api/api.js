const express = require('express');
const api = express.Router();

const storageValidate = require('../../modules/storage/middleware');

const unitRouter = require('../routers/unitRouter');
const objectRouter = require('../routers/objectRouter');
const customerRouter = require('../routers/customerRouter');
const supplierRouter = require('../routers/supplierRouter');
const exportRouter = require('../routers/exportRouter');
const importRouter = require('../routers/importRouter');
const importInfoRouter = require('../routers/importInfoRouter');
const exportInfoRouter = require('../routers/exportInfoRouter');
const storageRouter = require('../routers/storageRouter');
const messageRouter = require('../routers/messageRouter');
const userValidate = require('../../modules/user/middleware');

api.use('/unit', storageValidate.chosenStorageValidate, unitRouter)
    .use('/object', storageValidate.chosenStorageValidate, objectRouter)
    .use('/customer', storageValidate.chosenStorageValidate, customerRouter)
    .use('/supplier', storageValidate.chosenStorageValidate, supplierRouter)
    .use('/export', storageValidate.chosenStorageValidate, exportRouter)
    .use('/import', storageValidate.chosenStorageValidate, importRouter)
    .use('/importInfo', storageValidate.chosenStorageValidate, importInfoRouter)
    .use('/exportInfo', storageValidate.chosenStorageValidate, exportInfoRouter)
    .use('/storage', storageRouter)
    .use('/message', userValidate.loggedInValidate, messageRouter);

module.exports = api;