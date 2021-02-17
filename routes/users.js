const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../auth');

const Country = require('../models/countries');
const User = require('../models/users');

const router = express.Router();

router.get('/', function(req, res) {
  User.find({}).populate('country').exec((err, docs) => {
    res.send(JSON.stringify(docs));
  });
});

router.post('/',
  auth,
  body('name').isLength({ min: 2, max: 256 }),
  body('surname').isLength({ min: 2, max: 256 }),
  body('birthday').isISO8601(),
  body('countryCode').custom((value, { req }) => {
    return new Promise((resolve, reject) => {
      Country.find({countryCode: value}, (err, docs) => {
        if(err) reject(err);
        if(docs.length === 0) reject('Country code does not exist');
        resolve();
      });
    })
  }),
  function(req, res, next) {
    try{
      const errors = validationResult(req);
      if(!errors.isEmpty()){
        return res.status(400).json(errors.array());
      }
      Country.findOne({countryCode: req.body.countryCode}, (err, country) => {
        const newUser = new User({name:req.body.name, surname:req.body.surname, birthday:req.body.birthday, country:country._id});
        newUser.save(function (err, user) {
          if (err) next(err);
          else {
            User.findOne({_id: user._id}).populate('country').exec((err, user) => {
              console.log(user);
              res.status(201).send(JSON.stringify(user));
            });
          }
        });
      });
    }catch(err){
      next(err);
    }
  });

module.exports = router;