const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../auth');

const Country = require('../models/countries');

const router = express.Router();

router.get('/', function(req, res) {
  Country.find({}, (err, docs) => {
    res.send(JSON.stringify(docs));
  });
});

router.put('/',
  auth,
  // username must be an email
  body('countryCode').isLength({min: 2}),
  body('newName').isLength({min: 2}),
  body('newCountryCode').isLength({min: 2}),
  function(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.map((error) => ({error:'validation', ...error})));
      }
      Country.updateOne({ countryCode: req.body.countryCode }, { name: req.body.newName, countryCode: req.body.newCountryCode }, function(err, res) {
        if (err) next(err);
        else{
          if(res.modifiedCount > 0)
            res.status(201).json({numModified: res.modifiedCount});
          else{
            res.status(400).json([{error:'process', msg:'Resource not found. Modified ' + res.modifiedCount + ' resources'}]);
          }
        }
      });
    } catch (err) {
      next(err);
    }
  });

router.post('/',
  // auth,
  // username must be an email
  body('name').isLength({ min: 2, max:256 }),
  body('countryCode').custom((value, { req }) => {
    return new Promise((resolve, reject) => {
      Country.findOne({countryCode: value}, (err, doc) => {
        if (err) reject(err);
        if (doc) reject('Duplicate country -> same countryCode');
        resolve();
      });
    });
  }),
  function(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }
      const newCountry = new Country({name: req.body.name, countryCode: req.body.countryCode})
      newCountry.save().then((country) =>{
          res.status(201).send(JSON.stringify(country))
        },
        (err) => {
          res.status(400).json([{error: 'process', msg:err.message, param:'countryCode'}]);
        }
      );
    } catch (err) {
      next(err);
    }
  });

module.exports = router;