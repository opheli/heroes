const express = require('express');
const routes = require('./controllers/routes');
const app = express();
//const cors = require('cors');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/herosDatabase')
const db = mongoose.connection
db.on ('error', () => console.error())
db.once ('open', () => console.log('OK pour localhost:27017/herosDatabase'))

function debug(req, res, next){
    const date = new Date().toJSON()
    const { ip, method, path, protocol, httpVersion } = req
    console.log(`[HTTP] ${ip} - - [${date}] "${method} ${path} ${protocol}/${httpVersion}"`)
    next()
}

app.listen(8000);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(debug);
app.use('/', routes);

//app.use(cors())
