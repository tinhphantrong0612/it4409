const connection = require('../databaseConnection');
const config = require('../../config');

class User {
    Id;
    Username;
    Password;
    DisplayName;

    static async findOneByUsername(username) {
        let query = `SELECT * FROM user WHERE username = '${username}'`;
        return await connection.queryDB(query);
    }

    static async addUser(username, password, displayName) {
        let query = `INSERT INTO user (username, password, displayName) VALUES ("${username}", "${password}", "${displayName}")`;
        return await connection.queryDB(query);
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