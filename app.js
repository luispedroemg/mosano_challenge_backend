const express = require('express');
const { graphqlHTTP } = require('express-graphql');
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

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/', function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

app.use('/api',function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    next();
  },
  indexRouter
);
app.use(
  '/graphql',
  function (req, res, next) {
    res.setHeader('Content-Type', 'application/graphql');
    next();
  },
  graphqlHTTP({
    schema: require('./models/graph_ql/graphQLSchema'),
    graphiql: true,
  })
);

app.use(function (err, req, res, next) {
  console.error(err.message);
  const errResponse = { msg: err.message };
  if(err.error) errResponse.error = err.error;
  else errResponse.error = 'process';
  res.status(500).json([errResponse]);
});

module.exports = app;

