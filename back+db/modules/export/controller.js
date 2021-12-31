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
            res.status(200).send(result);
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    },
    post: async (req, res) => {
        try {
            const newId = uuidv4();
            const [saveExportResult, saveExportInfoResult] = await Promise.all([IExport.insert(newId, {
                ExportDate: Utils.toSQLDate(new Date()),
                CustomerId: req.body.CustomerId
            }), IExportInfo.insertExportInfoList(newId, req.body.ExportInfoList)]);
            if (saveExportResult.affectedRows < 1) {
                res.status(200).send("0");
            } else {
                res.status(201).send("1");
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
            const result = await IExport.delete(req.params.id);
            if (result.affectedRows < 1) {
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