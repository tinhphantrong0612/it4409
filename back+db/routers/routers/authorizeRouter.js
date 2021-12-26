const authorizeRouter = require('express').Router();
const authorizeController = require('../../modules/user/controller');

authorizeRouter .get('/', authorizeController.get)
                .post('/login', authorizeController.login)

module.exports = authorizeRouter;