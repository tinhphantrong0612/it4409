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
    }
}