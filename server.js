const express = require('express');
const app = express();
const path = require('path')

app.use(express.static(path.join(__dirname, 'public')));

app.use('/index', express.static(path.join(__dirname, 'public')))
// app.use('/analytics', express.static(path.join(__dirname, 'public'))

const port = process.env.PORT || 5001;

app.listen(port, ()=> {
    console.log(`app listening at port ${port}`);
});