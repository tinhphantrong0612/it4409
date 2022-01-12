const IObject = require('./model');
const IImportInfo = require('../importInfo/model');
const IExportInfo = require('../exportInfo/model');

module.exports = {
    getAll: async (req, res) => {
        try {
            const result = await IObject.getAll(req.session.StorageId);
            res.status(200).send(result);
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    },
    getById: async (req, res) => {
        try {
            const [result, importInfo, exportInfo] = await Promise.all([IObject.getById(req.params.id, req.session.StorageId), IImportInfo.getTotalObjectImportAmoutAndPrice(req.params.id, req.session.StorageId), IExportInfo.getTotalObjectExportAmoutAndPrice(req.params.id, req.session.StorageId)]);
            if (result.length == 0) {
                console.log("Get IObject: No content");
                res.status(204).send("0");
            } else {
                let trueResult = result[0];
                trueResult.ImportAmount = importInfo.Amount;
                trueResult.ExportAmount = exportInfo.Amount;
                trueResult.ImportMoney = importInfo.ImportMoney;
                trueResult.ExportMoney = exportInfo.ExportMoney;
                res.status(200).send(trueResult);
            }
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    },
    search: async (req, res) => {
        try {
            const result = await IObject.search(req.params.term, req.session.StorageId);
            res.status(200).send(result);
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    },
    post: async (req, res) => {
        try {
            const result = await IObject.insert(req.body.DisplayName.toUpperCase(), req.body.UnitId, req.session.StorageId);
            if (result.affectedRows) {
                res.status(201).send("1");
            } else {
                console.log("Post IObject: Not insert")
                res.status(200).send("Nope");
            }
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    },
    put: async (req, res) => {
        try {
            const result = await IObject.update(req.params.id, req.body.DisplayName.toUpperCase(), req.body.UnitId, req.session.StorageId);
            if (result.changedRows) {
                res.status(201).send("1");
            } else {
                console.log("Put IObject: Not update")
                res.status(200).send("Nope");
            }
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    },
    delete: async (req, res) => {
        try {
            const result = await IObject.delete(req.params.id, req.session.StorageId);
            if (result.affectedRows) {
                res.status(201).send("1");
            } else {
                console.log("Delete IObject: Not delete")
                res.status(200).send("Nope");
            }
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    }
}