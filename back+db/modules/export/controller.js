const IExport = require('./model');
const { v4: uuidv4 } = require('uuid');
const Utils = require('../../utils/Utils');
const IExportInfo = require('../exportInfo/model');

module.exports = {
    getAll: async (req, res) => {
        try {
            const result = await IExport.getAll();
            res.status(200).send(result);
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    },
    getById: async (req, res) => {
        try {
            const result = await IExport.getById(req.params.id);
            if (result.length > 0) {
                res.status(200).send(result[0]);
            } else {
                res.status(204).send({});
            }
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    },
    post: async (req, res) => {
        try {
            const newId = uuidv4();
            const [saveExportResult, saveExportInfoResult] = await Promise.allSettled([IExport.insert(newId, {
                ExportDate: Utils.toSQLDate(new Date()),
                CustomerId: req.body.CustomerId
            }), IExportInfo.insertExportInfoList(newId, req.body.ExportInfoList)]);
            if (saveExportResult.affectedRows < 1) {
                res.status(200).send(saveExportResult.affectedRows);
            } else {
                res.send(201).send(saveExportResult.affectedRows);
            }
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    },
    put: async (req, res) => {
        try {
            const result = await IExport.update(req.params.id, req.body);
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
            const result = await IExport.delete(req.params.id);
            if (result.affectedRows < 1) {
                res.status(200).send(result.affectedRows);
            } else {
                res.status(201).send(result.affectedRows);
            }
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    }
}