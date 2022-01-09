const connection = require('../databaseConnection');
const role = require('../../enum/role');

class User {
    Id;
    Username;
    Password;
    DisplayName;
    Role;

    constructor(Id, Username, Password, DisplayName, Role) {
        this.Id = Id;
        this.Username = Username;
        this.Password = Password;
        this.DisplayName = DisplayName;
        this.Role = Role;
    }
    
    /**
     * Tìm kiếm thông tin người dùng trong cơ sở dữ liệu từ Id
     * @param {Id} id Id người dùng cần lấy thông tin
     * @returns Trả về thông tin người dùng hoặc null nếu không tìm thấy
     */
    static async getOneById(id) {
        let query = `SELECT Username, Password, DisplayName, Role, Id FROM User WHERE Id=${id}`;
        let result = await connection.queryDB(query);
        if (result.length == 0) return null;
        else return result[0];
    }

    static async findOneByUsername(username) {
        let query = `SELECT Username, Password, DisplayName, Role, Id FROM user WHERE username = '${username}'`;
        let result = await connection.queryDB(query);
        if (result.length == 0) return null;
        else return result[0];
    }

    static async addUser(username, password, displayName) {
        let query = `INSERT INTO user (Username, Password, DisplayName, Role) VALUES ("${username}", "${password}", "${displayName}", ${role.user})`;
        return await connection.queryDB(query);
    }

    /**
     * Kiểm tra thông tin đăng nhập của người dùng
     * @param {String} username Tên đăng nhập
     * @param {String} password Mật khẩu
     * @returns {Promise<User>} Thông tin người dùng đăng nhập thành công, hoặc null nếu thất bại
     */
    static async authenticate(username, password) {
        let user = await User.findOneByUsername(username);
        if (user == null) return null;
        else {
            if (user.password != password) return null;
            else return user;
        }
    }
}

module.exports = User;