const express = require('express');
const path = require('path')

const app = express();

app.get('/', (req, res) => res.sendFile(path.resolve(__dirname, './front/index.html')));

app.listen(3000);

console.log("App listen at 3000");