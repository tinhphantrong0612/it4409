const Supplier = require('./model');

module.exports = {
    getAll: async (req, res) => {
        try {
            const result = await Supplier.getAll();
            res.status(200).send(result);
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    },
    getById: async (req, res) => {
        try {
            const result = await Supplier.getById(req.params.id);
            if (result.length == 0) {
                console.log("Get supplier: No content")
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
            const duplicateList = await Supplier.findByInfo(req.body.displayName, req.body.address, req.body.phone, req.body.email);
            if (duplicateList.length !== 0) {
                res.status(400).send("Duplicate supplier");
                return;
            }
            const result = await Supplier.post(req.body.displayName, req.body.address, req.body.phone, req.body.email, req.body.moreInfo);
            if (result.affectedRows) {
                res.status(201).send("1");
            } else {
                console.log("Post supplier: Not insert")
                res.status(200).send("Nope");
            }
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    },
    put: async (req, res) => {
        try {
            const duplicateList = await Supplier.findByInfo(req.body.displayName, req.body.address, req.body.phone, req.body.email);
            if (duplicateList.length !== 0) {
                res.status(400).send("Duplicate supplier");
                return;
            }
            const result = await Supplier.put(req.params.id, req.body.displayName, req.body.address, req.body.phone, req.body.email, req.body.moreInfo);
            if (result.changedRows) {
                res.status(201).send("1");
            } else {
                console.log("Put supplier: Not update")
                res.status(200).send("Nope");
            }
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    },
    delete: async (req, res) => {
        try {
            const result = await Supplier.delete(req.params.id);
            if (result.affectedRows) {
                res.status(201).send("1");
            } else {
                console.log("Delete supplier: Not delete")
                res.status(200).send("Nope");
            }
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    }
}