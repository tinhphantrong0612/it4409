const connection = require('../databaseConnection');
const role = require('../../enum/enum').role;

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
     * @returns Trả về thông tin admin hoặc người dùng cùng với danh sách kho hoặc null nếu không tìm thấy
     */
    static async getOneById(id) {
        let query = `SELECT Username, DisplayName, Role, Id FROM User WHERE Id=${id}`;
        let result = await connection.queryDB(query);
        if (result.length == 0) return null;
        else {
            let finalResult = result[0];
            if (finalResult.Role == role.user) {
                let storageQuery = `SELECT Storage.Id, Storage.DisplayName, Storage.Address FROM Storage INNER JOIN StorageUser ON Storage.Id=StorageUser.StorageId INNER JOIN User ON User.Id=StorageUser.UserId WHERE UserId=${finalResult.Id}`;
                finalResult.storages = await connection.queryDB(storageQuery);
            }
            return finalResult;
        }
    }

    /**
     * Get all users
     * @returns {Promise<List<User>>} list of all users
     */
    static async getAll() {
        let query = `SELECT Username, DisplayName, Role, Id FROM User`;
        return await connection.queryDB(query);
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

    static async addAdmin(username, password, displayName) {
        let query = `INSERT INTO user (Username, Password, DisplayName, Role) VALUES ("${username}", "${password}", "${displayName}", ${role.admin})`;
        return await connection.queryDB(query);
    }

    static async setAdmin(userId) {
        let query = `UPDATE User SET Role=${role.admin} WHERE Id=${userId}`;
        return await connection.queryDB(query);
    }

    static async checkUserStorage(userId, storageId) {
        let query = `SELECT * FROM StorageUser WHERE UserId=${userId} AND StorageId='${storageId}'`;
        let result = await connection.queryDB(query);
        if (result.length == 0) return false;
        else return true;
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
            if (user.Password != password) return null;
            else return user;
        }
    }

    /**
     * Get all storages that not associated with user
     * @param {*} userId 
     * @returns {Promise<Storage[]>} List of storage not associated with user
     */
    static async getNonAssignStorage(userId) {
        let query = `SELECT Storage.Id, Storage.Address, Storage.DisplayName FROM Storage WHERE Storage.Id NOT IN (SELECT StorageUser.StorageId FROM User INNER JOIN StorageUser ON User.Id=StorageUser.UserId WHERE User.Id=${userId} AND User.Role=${role.user})`;
        return await connection.queryDB(query);
    } 

    /**
     * Search with paging
     */
     static async searchByNameWithPaging(name, pageNumber, pageSize) {
        let startAfter = (pageNumber-1) * pageSize;
        let query = `SELECT User.Id, User.DisplayName, User.Username, User.Role FROM User WHERE User.DisplayName LIKE '%${name}%' OR User.Username LIKE '%${name}%' LIMIT ${startAfter}, ${pageSize}`;
        let queryCount = `SELECT Count(User.Id) as totalRecord FROM User WHERE User.DisplayName LIKE '%${name}%' OR User.Username LIKE '%${name}'`;
        let [data, countResult] = await Promise.all([connection.queryDB(query), connection.queryDB(queryCount)]);
        let totalRecord = countResult[0].totalRecord;
        let totalPage = totalRecord % pageSize == 0 && totalRecord !== 0 ? totalRecord / pageSize : Math.floor(totalRecord/pageSize) + 1;
        return {
            totalRecord,
            totalPage,
            data
        }
    }
}

module.exports = User;