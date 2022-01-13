const Message = require("./model");

module.exports = {
    emptyUserMessageValidate: (req, res, next) => {
        if (!req.body || !req.body.Message) res.status(400).send("Nội dung tin nhắn không được bỏ trống");
        else next();
    },
    emptyAdminResponseValidate: (req, res, next) => {
        if (!req.body || !req.body.Response) res.status(400).send("Nội dung phản hồi không được bỏ trống");
        else next();
    },
    /**
     * Check if there are any pending message (non-response), not allow user to have more than one pending message
     * @param {Request} req Request from client
     * @param {Response} res Response to client
     * @param {Function} next Next middleware function
     */
    pendingMessageValidate: async (req, res, next) => {
        let checkResult = await Message.checkPendingMessage(req.session.Id);
        if (checkResult == true) res.status(400).send("Tin nhắn trước đó đang chờ phản hồi, vui lòng chờ phản hồi trước khi gửi tin nhắn mới");
        else next();
    }
}