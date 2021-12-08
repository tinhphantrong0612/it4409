const authorizeRouter = require('express').Router();
const authorizeController = require('../../controllers/authorizeController');

authorizeRouter .get('/', authorizeController.get)
                .post('/login', authorizeController.login)

module.exports = authorizeRouter;