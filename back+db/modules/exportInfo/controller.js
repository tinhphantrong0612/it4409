const IExportInfo = require('./model')

module.exports = {
    getAll: async (req, res) => {
        try {
            const result = await IExportInfo.getAll();
            res.status(200).send(result);
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    },
    getById: async (req, res) => {
        try {
            const result = await IExportInfo.getById(req.params.id);
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
            const result = await IExportInfo.update(req.params.id, req.body);
            if (result.affectedRows < 1) {
                res.status(200).send(result.affectedRows);
            } else {
                res.status(201).send(result.affectedRows);
            }
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    },
    delete: async (req, res) => {
        try {
            let exportId = await IExportInfo.getExportId(req.params.id);
            let deleteResult = await IExportInfo.delete(req.params.id);
            await IExportInfo.checkLastExportInfoAndDelete(exportId);
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