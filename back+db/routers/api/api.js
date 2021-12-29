const express = require('express');
const api = express.Router();
const authorizeMiddleware = require('../../middlewares/authorizeMiddleware');
const unitRouter = require('../routers/unitRouter');
const objectRouter = require('../routers/objectRouter');
const customerRouter = require('../routers/customerRouter');

api.use('/unit', unitRouter)
    .use('/object', objectRouter)
    .use('/customer', customerRouter)

module.exports = api;