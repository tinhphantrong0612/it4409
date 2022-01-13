const { role } = require('../../enum/enum');
const Message = require('./model');

module.exports = {
    getAllMessageByAdmin: async(req, res) => {
        try {
            let result = await Message.getAllByAdmin();
            res.status(200).send(result);
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    },
    getAllMessageByUser: async (req, res) => {
        try {
            let result = await Message.getAllByUser(req.session.Id);
            res.status(200).send(result);
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    },
    getByIdFromAdmin: async(req, res) => {
        try {
            let [result, readResult] = await Promise.all([Message.getByIdFromAdmin(req.params.id), Message.readMessageByAdmin(req.params.id)]);
            if (result == null) {
                res.status(204).send({});
            } else res.status(200).send(result);
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    },
    getByIdFromUser: async(req, res) => {
        try {
            let result = await Message.getByIdFromUser(req.params.id, req.session.Id);
            if (result == null) {
                res.status(204).send({});
            } else {
                if (result.ResponseStatus > 0) await Message.readMessageByUser(req.params.id);
                res.status(200).send(result);
            }
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    },
    postMessage: async (req, res) => {
        try {
            let result = await Message.postMessage(req.session.Id, req.body.Message);
            if (result.affectedRows < 1)  {
                res.status(200).send("Không thể gửi tin nhắn");
            } else {
                res.status(201).send("Gửi tin nhắn thành công");
            }
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    },
    responseMessage: async (req, res) => {
        try {
            let result = await Message.responseMessage(req.params.id, req.body.Response);
            if (result.affectedRows < 1) {
                res.status(200).send("Phản hồi không thành công");
            } else {
                res.status(201).send("Phản hồi thành công");
            }
        } catch(error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    },
    deleteMessage: async (req, res) => {
        try {
            let result = null;
            if (req.session.Role == role.admin) result = await Message.deleteMessageByAdmin(req.params.id);
            else result = await Message.deleteMessageByUser(req.params.id, req.session.Id);
            if (result.affectedRows < 1) {
                res.status(200).send("Xóa không thành công");
            } else res.status(201).send("Xóa thành công");
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    }
}