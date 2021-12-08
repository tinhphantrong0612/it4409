const express = require('express');
const session = require('express-session');
const path = require('path');
// const sessionStore = require('./back+db/models/sessionConnection')

/**
 * Thêm các middleware cơ bản cho app
 * 
 * Viết bởi TìnhPT: 07/12/2021
 * 
 * @param {Express} app - Ứng dụng Server
 */
module.exports = function (app) {
    // Middleware session, thông tin phiên làm việc của người dùng được lưu trên server (Có thể sử dụng database)
    // xác định bởi cookie từ request, truy cập bằng req.session
    app.use(session({
        resave: false,
        saveUninitialized: false,
        key: 'cookey', // Tên cookie bên phía client
        secret: 'this_is_not_a_secret', // Khóa bí mật để sinh cookie
        cookie: {
            maxAge: 86400000 // Thời hạn của cookie
        }
        // store: sessionStore // Sử dụng database
    }))
        /**
         * urlencoded
         */
        .use(express.urlencoded({ extended: true }))
        /**
         * json body
         */
        .use(express.json())
        /**
         * Serve css, content, js
         */
        .use('/css', express.static('front/css'))
        .use('/content', express.static('front/content'))
        .use('/js', express.static('front/js'));
}