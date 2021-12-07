const mySql = require('mysql2');
const config = require('../config');

const connection = mySql.createPool(config.database);

// connection.connect((error) => {
//     if (error) {
//         console.log(error);
//     } else {
//         console.log("Connected");
//     }
// })

module.exports = connection;