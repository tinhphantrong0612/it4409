const express = require('express');
const api = express.Router();
const authorizeMiddleware = require('../../middlewares/authorizeMiddleware');
const unitRouter = require('../routers/unitRouter');
const objectRouter = require('../routers/objectRouter');

api.use('/unit', unitRouter)
    .use('/object', objectRouter)

module.exports = api;