const connection = require("../databaseConnection");
const { v4: uuidv4 } = require('uuid');
const role = require('../../enum/enum').role;

class IStorage {
    Id;
    DisplayName;
    Address;

    /**
     * Get list of all storages
     * @returns List of storages
     */
    static async getAll() {
        let query = "SELECT * FROM Storage";
        return await connection.queryDB(query);
    }

    /**
     * Get list of storages associated with user
     * @param {Number} id user id
     * @returns List of storages associated with user
     */
    static async getListByUserId(id) {
        let query = `SELECT Storage.Id, Storage.DisplayName, Storage.Address FROM Storage INNER JOIN StorageUser ON Storage.Id=StorageUser.StorageId WHERE StorageUser.UserId=${id}`;
        return await connection.queryDB(query);
    }

    /**
     * Get storage details by id, include storage info, users list, amount of object, amount of import and export
     * @param {String} id Storage id
     * @returns Storage's details
     */
    static async getDetailById(id) {
        // Get storage info
        let queryStorageInfo = `SELECT * FROM Storage WHERE Id='${id}'`;
        // Get list users associated with storage
        let queryUsers = `SELECT User.Username, User.DisplayName, User.Id FROM User INNER JOIN StorageUser ON User.Id=StorageUser.UserId WHERE StorageUser.StorageId='${id}'`;
        // Get number of object in storage  
        let queryCountObject = `SELECT Count(Id) as ObjectAmount FROM Object WHERE StorageId='${id}'`;
        // Get number of import in storage
        let queryCountImport = `SELECT Count(Id) as ImportAmount FROM Import WHERE StorageId='${id}'`;
        // Get number of export
        let queryCountExport = `SELECT Count(Id) as ExportAmount FROM Export WHERE StorageId='${id}'`;

        let [storeageInfo, users, countObject, countImport, countExport] = await Promise.all([connection.queryDB(queryStorageInfo), connection.queryDB(queryUsers), connection.queryDB(queryCountObject), connection.queryDB(queryCountImport), connection.queryDB(queryCountExport)])
        if (storeageInfo.length == 0) return null;
        let result = storeageInfo[0];
        result.Users = users;
        result.ObjectCount = countObject[0].ObjectAmount;
        result.ImportCount = countImport[0].ImportAmount;
        result.ExportCount = countExport[0].ExportAmount;
        return result;
    }

    /**
     * Check if storage name exist
     * @param {String} DisplayName Storage's name
     * @param {String} Id Storage Id, in case of insert, Id is null, otherwise, when update, check duplicate except with old record
     * @returns {Promise<Boolean>} true - duplicate; false - not
     */
    static async checkNameDuplicate(DisplayName, Id) {
        let query;
        if (Id == null) query = `SELECT * FROM Storage WHERE DisplayName='${DisplayName}'`;
        else query = `SELECT * FROM Storage WHERE DisplayName='${DisplayName}' AND NOT Id='${Id}'`;
        let result = await connection.queryDB(query);
        if (result.length == 0) return false;
        else return true;
    }
    /**
     * Add new storage into database
     * @param {String} DisplayName Storage's name
     * @param {String} Address Storage's address
     * @returns {Promise<ResultObject>} Insert result
     */
    static async insert(DisplayName, Address) {
        let query = `INSERT INTO Storage (DisplayName, Address, Id) VALUES ("${DisplayName}", "${Address}", "${uuidv4()}")`;
        return await connection.queryDB(query);
    }

    /**
     * Update storage info
     * @param {String} DisplayName Storage's name
     * @param {String} Address Storage's address
     * @param {String} Id Storage's Id
     * @returns {Promise<ResultObject>} Update result
     */
    static async update(DisplayName, Address, Id) {
        let query = `UPDATE Storage SET DisplayName='${DisplayName}', Address='${Address}' WHERE Id='${Id}'`;
        return await connection.queryDB(query);
    }

    /**
     * Delete a storage
     * @param {String} Id Storage to delete
     * @returns {Promise<ResultObject>} Result object
     */
    static async delete(Id) {
        let queryDeleteStorage = `DELETE FROM Storage WHERE Id='${Id}'`;
        let queryDeleteStorageUser = `DELETE FROM StorageUser WHERE StorageId='${Id}'`;
        await connection.queryDB(queryDeleteStorageUser);
        return await connection.queryDB(queryDeleteStorage);
    }

    /**
     * Check if there any table except storage and storageuser has storageId in
     * @param {String} Id Storage Id
     */
    static async checkEmptyStorage(Id) {
        let storageContains = [
            { table: 'Object', displayName: 'Mặt hàng' },
            { table: 'Customer', displayName: 'Khách hàng' },
            { table: 'Supplier', displayName: 'Nhà cung cấp' },
            { table: 'Import', displayName: 'Đơn nhập hàng' },
            { table: 'Export', displayName: 'Đơn xuất hàng' },
            { table: 'ImportInfo', displayName: 'Thông tin hàng nhập' },
            { table: 'ExportInfo', displayName: 'Thông tin xuất hàng' },
            { table: 'Unit', displayName: 'Đơn vị' }
        ];
        for (const thing of storageContains) {
            let query = `SELECT Id FROM ${thing.table} WHERE StorageId='${Id}'`;
            let result = await connection.queryDB(query);
            if (result.length != 0) throw new Error(`Không thể xóa. Kho vẫn còn ${thing.displayName.toLocaleLowerCase()}`);
        }
    }

    /**
     * Get list of user not associated with storage
     * @param {uuid} storageId Storage Id
     * @returns {Promise<List<User>>} List of user not associated with storage
     */
     static async getNonStorageManager(storageId) {
        let query = `SELECT User.Id, User.Username, User.DisplayName, User.Role FROM User WHERE NOT User.Role=${role.admin} AND Id NOT IN (SELECT User.Id FROM User INNER JOIN StorageUser ON StorageUser.UserId=User.Id WHERE StorageUser.StorageId='${storageId}')`;
        return await connection.queryDB(query);
    }

    static async addUserIntoStorage(userId, storageId) {
        let query = `INSERT INTO StorageUser (UserId, StorageId) VALUES (${userId}, '${storageId}')`;
        return await connection.queryDB(query);
    }

    static async removeUserFromStorage(userId, storageId) {
        let query = `DELETE FROM StorageUser WHERE UserId=${userId} AND StorageId='${storageId}'`;
        return await connection.queryDB(query);
    }

    static async isStorageExist(storageId) {
        let query = `SELECT Id FROM Storage WHERE Id='${storageId}'`;
        let result = await connection.queryDB(query);
        if (result.length == 0) return false;
        else return true;
    }

    static async isUserValid(userId, storageId) {
        let queryUserExist = `SELECT Id FROM User WHERE Id=${userId} AND Role=${role.user}`;
        let queryUserInStorage = `SELECT UserId From StorageUser WHERE UserId=${userId} AND StorageId='${storageId}'`;
        let [resultExist, resultInStorage] = await Promise.all([connection.queryDB(queryUserExist), connection.queryDB(queryUserInStorage)]);
        if (resultExist.length == 0) return false;
        else if (resultInStorage.length != 0) return false;
        else return true;
    }

    /**
     * Get list of all storages
     * @returns List of storages
     */
     static async search(name) {
        let query = `SELECT * FROM Storage WHERE DisplayName LIKE '%${name}%'`;
        return await connection.queryDB(query);
    }
}

module.exports = IStorage;