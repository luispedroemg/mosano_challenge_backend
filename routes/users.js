const express = require('express');
const { body, param } = require('express-validator');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

const Country = require('../models/countries');
const UserService = require('../service/users');

const router = express.Router();

router.get('/',
  function(req, res, next) {
  const options = { ... req.query, limit: parseInt(req.query.limit)};
  UserService.getUsers({}, options).then((users) =>
    UserService.getCount({}).then((total) => res.status(200).json({total, users: users})
    , (err) => next(err))
  , (err) => next(err));
});

router.get(
  '/:id',
  param('id').matches(/^[0-9a-fA-F]{24}$/),
  validate,
  function(req, res, next) {
    UserService.getUserById(req.params.id).then((user) => {
      return res.status(200).json(user);
    },(err) => next(err));
  });

router.put('/:id',
  auth,
  param('id').matches(/^[0-9a-fA-F]{24}$/),
  body('name').optional().isLength({min: 2, max: 256}),
  body('surname').optional().isLength({min: 2, max: 256}),
  body('birthday').optional().isISO8601(),
  body('countryCode').optional().isLength({min: 2, max: 2}).custom((value) => {
    return new Promise((resolve, reject) => {
      Country.find({countryCode: value}, (err, docs) => {
        if(err) reject(err);
        if(docs.length === 0) reject('Country code does not exist');
        resolve();
      });
    })
  }),
  validate,
  function(req, res, next) {
    UserService.updateUser(req.params.id, req.body).then((user) => {
      res.status(201).json(user);
    }, (err) => next(err));
  });

router.post('/',
  auth,
  body('name').isLength({ min: 2, max: 256 }),
  body('surname').isLength({ min: 2, max: 256 }),
  body('birthday').isISO8601(),
  body('countryCode').isLength({min: 2, max: 2}).custom((value) => {
    return new Promise((resolve, reject) => {
      Country.find({countryCode: value}, (err, docs) => {
        if(err) reject(err);
        if(docs.length === 0) reject('Country code does not exist');
        resolve();
      });
    })
  }),
  validate,
  function(req, res, next) {
    UserService.createUser(req.body).then((user) => {
      res.status(201).json(user);
    }, (err) => next(err));
  });

router.delete('/:id',
  auth,
  param('id').matches(/^[0-9a-fA-F]{24}$/),
  validate,
  function(req, res, next) {
    UserService.deleteUser(req.params.countryCode).then((user) => {
      res.status(201).json(user);
    }, (err) => next(err));
  });

module.exports = router;