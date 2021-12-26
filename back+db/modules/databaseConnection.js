const mySql = require('mysql2');
const config = require('../config');

const connection = mySql.createPool(config.database);
connection.queryDB = async (query) => {
    return new Promise((resolve, reject) => {
        connection.query(query, (error, result) => {
            if (error) reject(error);
            else resolve(result);
        })
    })
}

module.exports = connection;