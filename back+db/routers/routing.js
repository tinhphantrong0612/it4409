const express = require('express');
const path = require('path');
const userValidate = require('../modules/user/middleware');
const userRouter = require('./routers/userRouter');

/**
 * Định tuyến cho ứng dụng
 * 
 * Viết bởi TìnhPT - 07/12/2021 - Chưa xong
 * 
 * @param {Express} app - Ứng dụng Server
 */

module.exports = function (app) {
    let api = require('./api/api');
    app .use('/user', userRouter)
        /**
         * Khi dùng api để lấy dữ liệu, sử dụng module api
         */
        .use('/api', userValidate.loggedInValidate, api)
        /**
         * Trả về 404 nếu đường dẫn không được quy định
         */
        .use((req, res) => { res.status(404).send("URL not found") });
}