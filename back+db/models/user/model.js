const connection = require('../databaseConnection');
const config = require('../../config');

class User {
    static findOneByUsername(username) {
        let query = `SELECT * FROM ${config.database.database}.user WHERE username = ${username}`;
        return new Promise((resolve, reject) => {
            connection.query(query, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result[0]);
                }
            })
        })
    }

    static addUser(username, password, displayName, idrole) {
        let query = `INSERT INTO ${config.database.database}.user (username, password, displayName, IdRole) VALUES ("${username}", "${password}", "${displayName}", ${idrole})`;
        return new Promise((resolve, reject) => {
            connection.query(query, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve("Success");
                }
            })
        })
    }

    static async login(username, password) {
        try {
            let user = await User.findOneByUsername(username);
            if (!user || user.password !== password) {
                return {
                    success: false,
                    error: "Tên đăng nhập hoặc mật khẩu không chính xác"
                }
            } else {
                return {
                    success: true
                }
            }
        } catch (error) {
            return {
                success: false,
                error: error
            }
        }
    }

    static async register(username, password, displayName, idrole) {
        try {
            let result = await User.addUser(username, password, displayName, idrole);
            return {
                success: true
            }
        } catch (error) {
            return {
                success: false,
                error: error
            }
        }
    }
}

module.exports = User;