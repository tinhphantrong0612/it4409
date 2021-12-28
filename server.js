const express = require('express');
const routing = require('./back+db/routers/routing');
const cors = require('cors');
const initializeStandardMiddleware = require('./back+db/middlewares/initializeStandardMiddleware');

const app = express();
app.use(cors({
    allowedHeaders: '*',
    origin: "*"
}))
// Thêm các middleware cơ bản cho app
initializeStandardMiddleware(app);
// Định tuyến
routing(app);

app.listen(3000);

console.log("App listen at 3000");