const IImportInfo = require('./model')

module.exports = {
    getAll: async (req, res) => {
        try {
            const result = await IImportInfo.getAll(req.session.storageId);
            res.status(200).send(result);
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    },
    getById: async (req, res) => {
        try {
            const result = await IImportInfo.getById(req.params.id,req.session.storageId);
            if (result.length == 0) {
                res.status(204).send({});
            } else {
                res.status(200).send(result[0]);
            }
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    },
    put: async (req, res) => {
        try {
            const result = await IImportInfo.update(req.params.id, req.session.storageId, req.body);
            if (result.affectedRows < 1) {
                res.status(200).send("0");
            } else {
                res.status(201).send("1");
            }
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    },
    delete: async (req, res) => {
        try {
            let importId = await IImportInfo.getImportId(req.params.id, req.session.storageId);
            let deleteResult = await IImportInfo.delete(req.params.id, req.session.storageId);
            await IImportInfo.checkLastImportInfoAndDelete(importId, req.session.storageId);
            if (deleteResult.affectedRows < 1) {
                res.status(200).send("0");
            } else {
                res.status(201).send("1");
            }
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    }
}