const express = require('express');
const { body, validationResult } = require('express-validator');

const Country = require('../models/countries');

const router = express.Router();

router.get('/', function(req, res) {
  Country.find({}, (err, docs) => {
    res.send(JSON.stringify(docs));
  });
});

router.put('/',
  // username must be an email
  body('name').isLength({min: 2}),
  body('newName').isLength({min: 2}),
  body('newCountryCode').isLength({min: 2}),
  function(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.map((error) => ({error:'validation', ...error})));
      }
      Country.updateOne({ name: req.body.name }, { name: req.body.newName, countryCode: req.body.newCountryCode }, function(err, res) {
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
  // username must be an email
  body('name').isLength({ min: 2, max:256 }),
  body('countryCode').isLength({min:2, max:2}),
  function(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }
      const countryList = Country.find({countryCode: req.body.countryCode}).exec();
      const newCountry = new Country({name: req.body.name, countryCode: req.body.countryCode})
      newCountry.save().then((country) =>{
          res.status(201).send(JSON.stringify(country))
        },
        (err) => {
          console.log(err);
          next(err);
        }
      );
    } catch (err) {
      next(err);
    }
  });

module.exports = router;