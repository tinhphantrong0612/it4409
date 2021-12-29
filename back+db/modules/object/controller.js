const IObject = require('./model');
const IImportInfo = require('../importInfo/model');
const IExportInfo = require('../exportInfo/model');

module.exports = {
    getAll: async (req, res) => {
        try {
            const result = await IObject.getAll();
            res.status(200).send(result);
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    },
    getById: async (req, res) => {
        try {
            const [result, importInfo, exportInfo] = await Promise.all([IObject.getById(req.params.id), IImportInfo.getTotalObjectAmoutAndPrice(req.params.id), IExportInfo.getTotalObjectAmoutAndPrice(req.params.id)]);           
            if (result.length == 0) {
                console.log("Get IObject: No content");
                res.status(204).send("0");
            } else {
                let trueResult = result[0];
                trueResult.importAmount = importInfo.amount;
                trueResult.exportAmount = exportInfo.amount;
                trueResult.importMoney = importInfo.importMoney;
                trueResult.exportMoney = exportInfo.exportMoney;
                res.status(200).send(trueResult);
            }
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    },
    post: async (req, res) => {
        try {
            const result = await IObject.insert(req.body.DisplayName.toUpperCase(), req.body.UnitId);
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
            const result = await IObject.update(req.params.id, req.body.DisplayName.toUpperCase(), req.body.UnitId);
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
            const result = await IObject.delete(req.params.id);
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