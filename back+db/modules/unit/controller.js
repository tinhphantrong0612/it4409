const Unit = require('./model');

module.exports = {
    getAll: async (req, res) => {
        try {
            const result = await Unit.getAll();
            res.status(200).send(result);
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    },
    getById: async (req, res) => {
        try {
            const result = await Unit.getById(req.params.id);
            if (result.length == 0) {
                console.log("Get unit: No content")
                res.status(204).send(result);
            } else {
                res.status(200).send(result);
            }
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    },
    post: async (req, res) => {
        try {
            const duplicateList = await Unit.findByName(req.body.name.toUpperCase());
            if (duplicateList.length !== 0) {
                res.status(400).send("Duplicate unit");
                return;
            }
            const result = await Unit.post(req.body.name.toUpperCase());
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
            const duplicateList = await Unit.findByName(req.body.name.toUpperCase());
            if (duplicateList.length !== 0) {
                res.status(400).send("Duplicate unit");
                return;
            }
            const result = await Unit.put(req.params.id, req.body.name.toUpperCase());
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
            const result = await Unit.delete(req.params.id);
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