const badwords = require('../enum/badwords');

module.exports = {
    trimBody: (req, res, next) => {
        if (req.body) {
            let keyArr = Object.keys(req.body);
            for (const key of keyArr) {
                if (typeof(req.body[key]) == "string") req.body[key] = req.body[key].trim();
            }
        }
        next();
    },
    badWordsDetect: (req, res, next) => {
        if (req.body) {
            let keyArr = Object.keys(req.body);
            for (const key of keyArr) {
                if (typeof(req.body[key]) == "string") {
                    let wordStr = req.body[key].toLowerCase().split(" ").join("");

                    var foundBadWords = badwords.filter(e => wordStr.includes(e));
                    foundBadWords.join(", ");
                    if (foundBadWords.length != 0) {
                        res.status(400).send("Vui lòng không nhập từ xấu: " + foundBadWords);
                        return;
                    }
                }
            }
        }
        next();
    },
    pagingFilter: (req, res, next) => {
        if (isNaN(Number(req.query.pageNumber)) || isNaN(Number(req.query.pageSize))) {
            res.status(400).send("Kích thước phân trang không hợp lệ");
        } else {
            req.query.pageNumber = Math.floor(req.query.pageNumber);
            req.query.pageSize = Math.floor(req.query.pageSize);
            if (req.query.pageNumber < 0) req.query.pageNumber = 1;
            if (req.query.pageSize < 0) req.query.pageSize = 10;
            if (req.query.pageSize > 50) req.query.pageSize = 50;
            next();
        }
    }
}