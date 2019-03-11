const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const config = require('./db');
const Article = require('./models/Article');
const ArticleRoute = require('./routes/ArticleRoute');

const PORT = 8080;

mongoose.connect(config.DB,  { useNewUrlParser: true }).then(
    () => {console.log('Database is connected') },
    err => { console.log('Can not connect to the database' +err)
});


app.use(function(req, res, next) {
       res.header("Access-Control-Allow-Origin", "*");
       res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
       res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
          next();
    });
app.use(bodyParser.json());
app.use('/v1/articles', ArticleRoute);

app.listen(PORT, function(){
    console.log('Your node js server is running on PORT:',PORT);
});
