const Unit = require('./model');

module.exports = {
    getAll: async (req, res) => {
        try {
            const result = await Unit.getAll(req.session.StorageId);
            res.status(200).send(result);
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    },
    getById: async (req, res) => {
        try {
            const result = await Unit.getById(req.params.id, req.session.StorageId);
            if (result.length == 0) {
                console.log("Get unit: No content")
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
            const result = await Unit.insert(req.body.DisplayName.toUpperCase(), req.session.StorageId);
            if (result.insertId) {
                res.status(201).send("1");
            } else {
                console.log("Post unit: Not insert")
                res.status(200).send("Nope");
            }
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    },
    put: async (req, res) => {
        try {
            const result = await Unit.update(req.params.id, req.body.DisplayName.toUpperCase(), req.session.StorageId);
            if (result.changedRows) {
                res.status(201).send("1");
            } else {
                console.log("Put unit: Not update")
                res.status(200).send("Nope");
            }
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    },
    delete: async (req, res) => {
        try {
            const result = await Unit.delete(req.params.id, req.session.StorageId);
            if (result.affectedRows) {
                res.status(201).send("1");
            } else {
                console.log("Delete unit: Not delete")
                res.status(200).send("Nope");
            }
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    }
}