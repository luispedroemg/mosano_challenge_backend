const express = require('express');
const logger = require('morgan');
const db = require('./db');
const indexRouter = require('./routes/index');
require('dotenv').config();

db.connect().then(
  (db) => console.log(`Connected to DB ${db}`),
  (err) => {
    console.log(`Could not connect to database: ${err}`);
    process.exit(1);
  }
);

const app = express();

app.use(function (req, res, next) {
  // TODO: Specify only exactly what is needed
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Content-Type', 'application/json');
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/', indexRouter);

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).json([{error:'process', msg:err.message}]);
})

module.exports = app;

