module.exports = {
    trimBody: (req, res, next) => {
        if (req.body) {
            let keyArr = Object.keys(req.body);
            for (const key of keyArr) {
                req.body[key] = req.body[key].trim();
            }
        }
        next();
    }
}