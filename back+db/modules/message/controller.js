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
    searchByAdmin: async (req, res) => {
        try {
            let result = await Message.searchByAdmin(req.query.filter, req.query.pageSize, req.query.pageNumber);
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
                res.status(200).send("Kh??ng th??? g???i tin nh???n");
            } else {
                res.status(201).send("G???i tin nh???n th??nh c??ng");
                // Khi ng?????i d??ng g???i tin nh???n th??ng b??o cho t???t c??? c??c admin
                for (const key in req.app.adminSubscriber) {
                    if (Object.hasOwnProperty.call(req.app.adminSubscriber, key)) {
                        const response = req.app.adminSubscriber[key];
                        response.status(200).send("Tin nh???n m???i");
                    }
                }
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
                res.status(200).send("Ph???n h???i kh??ng th??nh c??ng");
            } else {
                res.status(201).send("Ph???n h???i th??nh c??ng");
                // Khi admin response, th??ng b??o ?????n ng?????i d??ng c??? th???
                let userId = await Message.getUserIdFromMessageId(req.params.id);
                if (req.app.userSubscriber[userId]) {
                    req.app.userSubscriber[userId].status(200).send("Tin nh???n m???i");
                    delete req.app.userSubscriber[userId];
                }
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
                res.status(200).send("X??a kh??ng th??nh c??ng");
            } else res.status(201).send("X??a th??nh c??ng");
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    },
    userSubscribe: async (req, res) => {
        if (!req.app.userSubscriber) req.app.userSubscriber = Object.create(null);
        req.app.userSubscriber[req.session.Id] = res;
        req.on('close', () => {
            delete req.app.userSubscriber[req.session.Id];
        })
    },
    adminSubscribe: async (req, res) => {
        if (!req.app.adminSubscriber) req.app.adminSubscriber = Object.create(null);
        req.app.adminSubscriber[req.session.Id] = res;
        req.on('close', () => {
            delete req.app.adminSubscriber[req.session.Id];
        })
    }
}