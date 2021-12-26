const session = require('express-session');
const mysql2 = require('mysql2/promise');
const MySQLStore = require('express-mysql-session')(session);

/**
 * Tạo kết nối tới database để lưu thông tin session
 */
const options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    database: 'it4409_session'
};

const connection = mysql2.createPool(options);
const sessionStore = new MySQLStore({
    createDatabaseTable: true,
    clearExpired: true,
    checkExpirationInterval: 900000,
    expiration: 86400000
}, connection);

module.exports = sessionStore;