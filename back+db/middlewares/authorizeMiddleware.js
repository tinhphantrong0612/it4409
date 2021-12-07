/**
 * 
 * @param {Request} req Do ứng dụng truyền - Request từ client, truy cập phiên làm việc (session) thông qua req.session
 * @param {Response} res Do ứng dụng truyền - Response để trả lời request từ client
 * @param {Function} next Do ứng dụng truyền - Middleware tiếp theo 
 */

module.exports = (req, res, next) => {
    // Unauthorized, redirect to login
    if (!req.session.userId) {
        res.redirect('/login');
    } else next();
}