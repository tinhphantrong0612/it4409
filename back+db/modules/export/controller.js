const IExport = require('./model');
const { v4: uuidv4 } = require('uuid');
const Utils = require('../../utils/Utils');
const IExportInfo = require('../exportInfo/model');

module.exports = {
    getAll: async (req, res) => {
        try {
            const result = await IExport.getAll(req.session.storageId);
            res.status(200).send(result);
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    },
    getById: async (req, res) => {
        try {
            const result = await IExport.getById(req.params.id, req.session.storageId);
            res.status(200).send(result);
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    },
    post: async (req, res) => {
        try {
            const newId = uuidv4();
            const [saveExportResult, saveExportInfoResult] = await Promise.all([IExport.insert(newId, req.session.storageId, {
                ExportDate: Utils.toSQLDate(new Date()),
                CustomerId: req.body.CustomerId
            }), IExportInfo.insertExportInfoList(newId, req.body.ExportInfoList, req.session.storageId)]);
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
            const result = await IExport.update(req.params.id, req.session.storageId, req.body);
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
            const result = await IExport.delete(req.params.id, req.session.storageId);
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