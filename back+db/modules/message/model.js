const connection = require("../databaseConnection");
const status = require('../../enum/enum').status;

class Message {
    Id;
    UserId;
    Username;
    UserDisplayName;
    Message;
    Response;
    MessageStatus;
    ResponseStatus;
    SentAt;

    static async getAllByAdmin() {
        let query = `SELECT Message.Id, Message.UserId, Message.Message, Message.Response, Message.MessageStatus, Message.ResponseStatus, Message.SentAt, User.Username as Username, User.DisplayName as UserDisplayName FROM Message INNER JOIN User ON User.Id=Message.UserId ORDER BY Message.SentAt DESC`;
        return await connection.queryDB(query);
    }

    static async searchByAdmin(term) {
        let query = `SELECT Message.Id, Message.UserId, Message.Message, Message.Response, Message.MessageStatus, Message.ResponseStatus, Message.SentAt, User.Username as Username, User.DisplayName as UserDisplayName FROM Message INNER JOIN User ON User.Id=Message.UserId WHERE User.DisplayName LIKE '%${term}%' OR User.Username LIKE '%${term}%' ORDER BY Message.SentAt DESC`;
        return await connection.queryDB(query);
    }

    static async getAllByUser(userId) {
        let query = `SELECT * FROM Message WHERE UserId=${userId}`;
        return await connection.queryDB(query);
    }

    static async getByIdFromUser(id, userId) {
        let query = `SELECT Message.Id, Message.UserId, Message.Message, Message.Response, Message.MessageStatus, Message.ResponseStatus, Message.SentAt, User.Username as Username, User.DisplayName as UserDisplayName FROM Message INNER JOIN User ON User.Id=Message.UserId WHERE Message.Id=${id} AND User.Id=${userId}`;
        let result = await connection.queryDB(query);
        if (result.length == 0) return null;
        else return result[0];
    } 

    static async getByIdFromAdmin(id) {
        let query = `SELECT Message.Id, Message.UserId, Message.Message, Message.Response, Message.MessageStatus, Message.ResponseStatus, Message.SentAt, User.Username as Username, User.DisplayName as UserDisplayName FROM Message INNER JOIN User ON User.Id=Message.UserId WHERE Message.Id=${id}`;
        let result = await connection.queryDB(query);
        if (result.length == 0) return null;
        else return result[0];
    } 

    static async postMessage(userId, message) {
        let query = `INSERT INTO Message (UserId, Message, MessageStatus, ResponseStatus) VALUES (${userId}, '${message}', ${status.new}, ${status.none})`;
        return await connection.queryDB(query);
    } 

    static async readMessageByAdmin(id) {
        let query = `UPDATE Message SET MessageStatus=${status.read} WHERE Id=${id}`;
        return await connection.queryDB(query);
    }

    static async readMessageByUser(id) {
        let query = `UPDATE Message SET ResponseStatus=${status.read} WHERE Id=${id}`;
        return await connection.queryDB(query);
    }

    static async responseMessage(id, response) {
        let query = `UPDATE Message SET Response='${response}', MessageStatus=${status.read}, ResponseStatus=${status.new} WHERE Id=${id}`;
        return await connection.queryDB(query);
    }

    static async deleteMessageByAdmin(id) {
        let query = `DELETE FROM Message WHERE Id=${id}`;
        return await connection.queryDB(query);
    }
    
    static async deleteMessageByUser(id, userId) {
        let query = `DELETE FROM Message WHERE Id=${id} AND UserId=${userId}`;
        return await connection.queryDB(query);
    }

    /**
     * Check pending message, not allow user send message when others hasn't been responsed
     * @param {number} userId Id of messenger
     * @returns {Promise<boolean>} true - if there is a pending message, false - if there are none.
     */
    static async checkPendingMessage(userId) {
        let query = `SELECT * FROM Message WHERE UserId=${userId} AND ResponseStatus=${status.none}`;
        let result= await connection.queryDB(query);
        if (result.length == 0) return false;
        else return true;
    }

    static async getUserIdFromMessageId(messageId) {
        let query = `SELECT UserId FROM Message WHERE Id=${messageId}`;
        let message = await connection.queryDB(query);
        return message[0].UserId;
    }
}

module.exports = Message;