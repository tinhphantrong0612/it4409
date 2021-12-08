const mySql = require('mysql2');
const config = require('../config');

const connection = mySql.createPool(config.database);

module.exports = connection;