const express = require('express');
const api = express.Router();
const authorizeMiddleware = require('../../middlewares/authorizeMiddleware');
const unitRouter = require('../routers/unitRouter');

api.use('/unit', unitRouter)
.use((req, res) => {
    res.send("Congratulation, you are in");
});

module.exports = api;