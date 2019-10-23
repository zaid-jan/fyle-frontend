const express = require('express');
const app = express();
const path = require('path')

app.use(express.static(path.join(__dirname, 'public')));

app.use('/index', express.static(path.join(__dirname, 'public')))
// app.use('/analytics', express.static(path.join(__dirname, 'public'))

app.listen(8000, ()=> {
    console.log('app listening at port 8000');
});