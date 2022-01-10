const Customer = require('./model');

module.exports = {
    getAll: async (req, res) => {
        try {
            const result = await Customer.getAll(req.session.StorageId);
            res.status(200).send(result);
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    },
    getById: async (req, res) => {
        try {
            const result = await Customer.getById(req.params.id, req.session.StorageId);
            if (result.length == 0) {
                console.log("Get customer: No content")
                res.status(204).send({});
            } else {
                res.status(200).send(result[0]);
            }
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    },
    post: async (req, res) => {
        try {
            const result = await Customer.post(req.body.displayName, req.body.address, req.body.phone, req.body.email, req.session.StorageId, req.body.moreInfo);
            if (result.affectedRows) {
                res.status(201).send("1");
            } else {
                console.log("Post customer: Not insert")
                res.status(200).send("Nope");
            }
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    },
    put: async (req, res) => {
        try {
            const result = await Customer.put(req.params.id, req.body.displayName, req.body.address, req.body.phone, req.body.email, req.session.StorageId, req.body.moreInfo);
            if (result.changedRows) {
                res.status(201).send("1");
            } else {
                console.log("Put customer: Not update")
                res.status(200).send("Nope");
            }
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    },
    delete: async (req, res) => {
        try {
            const result = await Customer.delete(req.params.id, req.session.StorageId);
            if (result.affectedRows) {
                res.status(201).send("1");
            } else {
                console.log("Delete customer: Not delete")
                res.status(200).send("Nope");
            }
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    }
}