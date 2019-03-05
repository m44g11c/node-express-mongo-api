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

app.use(bodyParser.json());
app.use('/v1/articles', ArticleRoute);

app.listen(PORT, function(){
    console.log('Your node js server is running on PORT:',PORT);
});
