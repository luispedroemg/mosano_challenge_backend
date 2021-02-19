const express = require('express');
const { body, param } = require('express-validator');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

const Country = require('../models/countries');
const CountryService = require('../service/countries');

const router = express.Router();

router.get('/', function(req, res, next) {
  const options = { ... req.query, limit: parseInt(req.query.limit)};
  CountryService.getCountries({}, options).then((countries) => {
    return res.status(200).json(countries);
  },(err) => next(err));
});

router.get(
  '/:countryCode',
  param('countryCode').isLength({min:2, max:2}),
  validate,
  function(req, res, next) {
    CountryService.getCountryByCode(req.params.countryCode).then((country) => {
      return res.status(200).json(country);
    },(err) => next(err));
});

router.put('/:countryCode',
  auth,
  param('countryCode').isLength({min:2, max:2}),
  body('name').optional().isLength({min: 2}),
  body('countryCode').optional().isLength({min: 2, max: 2}),
  validate,
  function(req, res, next) {
    CountryService.updateCountry(req.params.countryCode, { countryName: req.body.name, newCountryCode: req.body.countryCode }).then((country) => {
      res.status(201).json(country);
    }, (err) => next(err));
  });

router.post('/',
  auth,
  body('name').isLength({ min: 2, max:256 }),
  body('countryCode').isLength({min:2, max:2}).custom((value) => {
    return new Promise((resolve, reject) => {
      Country.findOne({countryCode: value}, (err, doc) => {
        if (err) reject(err);
        if (doc) reject('Duplicate country -> same countryCode');
        resolve();
      });
    });
  }),
  validate,
  function(req, res, next) {
    CountryService.createCountry({countryCode: req.body.countryCode, countryName: req.body.name}).then((country) => {
      res.status(201).json(country);
    }, (err) => next(err));
  });

router.delete('/:countryCode',
  auth,
  param('countryCode').isLength({min:2, max:2}),
  validate,
  function(req, res, next) {
    CountryService.deleteCountry(req.params.countryCode).then((country) => {
      res.status(201).json(country);
    }, (err) => next(err));
  });

module.exports = router;