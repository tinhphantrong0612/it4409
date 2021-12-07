const express = require('express');

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

    // Định tuyến, việc đặt thứ tự có ý nghĩa quan trọng
    /**
     * Mọi hoạt động yêu cầu đăng nhập
     * Nếu đã đăng nhập mà truy cập vào trang đăng nhập, sẽ được chuyển tới trang chủ
     */
    app.get('/login', (req, res) => {
        if (req.session.userId) res.redirect('/');
        else {
            req.session.userId = true;
            res.send("Authorized");
        }
    })
    /**
     * Kiểm tra đăng nhập trước khi vào các đường dẫn khác
     * Chuyển hướng về /login nếu chưa đăng nhập
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
     * Đường dẫn không được quy định, chuyển hướng về /,
     * Dù là chuyển hướng về /, vẫn sẽ phải đi theo thứ tự từ đầu, tức là khi chưa đăng nhập,
     * sẽ phải đi qua authorizeMiddleware, và bị quay trở lại /login
     */
    .use((req, res) => { res.redirect('/') })
}