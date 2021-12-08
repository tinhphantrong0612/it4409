const express = require('express');
const path = require('path');

/**
 * Định tuyến cho ứng dụng
 * 
 * Viết bởi TìnhPT - 07/12/2021 - Chưa xong
 * 
 * @param {Express} app - Ứng dụng Server
 */

module.exports = function (app) {
    let api = require('./api/api');
    let authorizeMiddleware = require('../middlewares/authorizeMiddleware');
    let authorizeRouter = require('../routers/routers/authorizeRouter');

    // Định tuyến, việc đặt thứ tự có ý nghĩa quan trọng
    /**
     * Mọi hoạt động yêu cầu đăng nhập
     * Nếu đã đăng nhập mà truy cập vào trang đăng nhập, sẽ được chuyển tới trang chủ
     */
    app.use('/authorize', authorizeRouter)
        /**
         * Kiểm tra đăng nhập trước khi vào các đường dẫn khác
         * Chuyển hướng về /authorize nếu chưa đăng nhập
         */
        .use(authorizeMiddleware)
        /**
         * Serve static thư mục front
         */
        .use('/', express.static('front'))
        /**
         * Khi dùng api để lấy dữ liệu, sử dụng module api
         */
        .use('/api', api)
        /**
         * Trả về 404 nếu đường dẫn không được quy định
         */
        .use((req, res) => { res.status(404).send("URL not found") });
}