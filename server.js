const express = require('express');
const path = require('path')

const app = express();

app.use(express.static('front'))
app.listen(3000);

console.log("App listen at 3000");