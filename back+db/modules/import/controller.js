const IImport = require('./model');
const { v4: uuidv4 } = require('uuid');
const Utils = require('../../utils/Utils');
const IImportInfo = require('../importInfo/model');

module.exports = {
    getAll: async (req, res) => {
        try {
            const result = await IImport.getAll(req.session.StorageId);
            res.status(200).send(result);
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    },
    getById: async (req, res) => {
        try {
            const result = await IImport.getById(req.params.id, req.session.StorageId);
            if (!result.ImportInfoList) res.status(204).send(result);
            else res.status(200).send(result);
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    },
    post: async (req, res) => {
        try {
            const newId = uuidv4();
            const [saveImportResult, saveImportInfoResult] = await Promise.all([IImport.insert(newId, req.session.StorageId, {
                ImportDate: Utils.toSQLDate(new Date()),
                SupplierId: req.body.SupplierId
            }), IImportInfo.insertImportInfoList(newId, req.session.StorageId, req.body.ImportInfoList)]);
            if (saveImportResult.affectedRows < 1) {
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
            const result = await IImport.update(req.params.id, req.session.StorageId, req.body);
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
            const result = await IImport.delete(req.params.id, req.session.StorageId);
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
    search: async (req, res) => {
        try {
            const result = await IImport.searchBySupplierName(req.query.filter, req.session.StorageId);
            res.status(200).send(result);
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    }
}