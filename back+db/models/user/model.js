const connection = require('../databaseConnection');
const config = require('../../config');

class User {
    Id;
    Username;
    Password;
    DisplayName;

    static findOneByUsername(username) {
        let query = `SELECT * FROM ${config.database.database}.user WHERE username = '${username}'`;
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

    static addUser(username, password, displayName) {
        let query = `INSERT INTO ${config.database.database}.user (username, password, displayName) VALUES ("${username}", "${password}", "${displayName}")`;
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
            if (!user || user.Password !== password) {
                return {
                    status: 400,
                    error: "Tên đăng nhập hoặc mật khẩu không chính xác"
                }
            } else {
                return {
                    status: 200,
                    user
                }
            }
        } catch (error) {
            console.log(error);
            return {
                success: 500,
                error: "Internal Server Error"
            }
        }
    }

    static async register(username, password, displayName) {
        try {
            let result = await User.addUser(username, password, displayName);
            return {
                status: 200
            }
        } catch (error) {
            return {
                status: 400,
                error: error
            }
        }
    }
}

module.exports = User;