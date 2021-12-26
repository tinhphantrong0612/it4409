const path = require('path');
const User = require('./model');

module.exports = {
    get: async (req, res) => {
        if (req.session.Id) res.redirect('/');
        else {
            res.sendFile(path.resolve(__dirname, '../../../front/login.html'));
        }
    },
    login: async (req, res) => {
        if (req.body && req.body.username && req.body.password) {
            let result = await User.login(req.body.username, req.body.password);
            if (result.status === 200) {
                req.session.Id = result.user.Id
            }
            res.status(result.status);
            res.send(result);
        }
    }
}