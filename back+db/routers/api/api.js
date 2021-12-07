const express = require('express');
const api = express.Router();
const authorizeMiddleware = require('../../middlewares/authorizeMiddleware');

api.use((req, res) => {
    res.send("Congratulation, you are in");
});

module.exports = api;