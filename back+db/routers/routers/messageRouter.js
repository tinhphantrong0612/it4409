const role = require('../../enum/enum').role;
const messageController = require('../../modules/message/controller');
const messageRouter = require('express').Router();
const messageValidate = require('../../modules/message/middleware');
const userValidate = require('../../modules/user/middleware');


messageRouter
    .get('/', (req, res) => {
        if (req.session.Role == role.admin) {
            messageController.getAllMessageByAdmin(req, res);
        } else if (req.session.Role == role.user) {
            messageController.getAllMessageByUser(req, res);
        } else {
            res.status(500).send("Internal Server Error");
        }
    })
    .get('/search', userValidate.isAdminValidate, messageController.searchByAdmin)
    .get('/:id', (req, res) => {
        if (req.session.Role == role.admin) {
            messageController.getByIdFromAdmin(req, res);
        } else if (req.session.Role == role.user) {
            messageController.getByIdFromUser(req, res);
        } else {
            res.status(500).send("Internal Server Error");
        }
    })
    .post('/',
        userValidate.isUserValidate, // Must be user
        messageValidate.emptyUserMessageValidate, // Not empty
        messageValidate.pendingMessageValidate, // Not duplicated name
        messageController.postMessage
    )
    .put('/:id',
        userValidate.isAdminValidate, // Must be admin
        messageValidate.emptyAdminResponseValidate, // Not empty
        messageController.responseMessage
    )
    .delete('/:id', messageController.deleteMessage)

module.exports = messageRouter;