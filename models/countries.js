const mongoose = require('mongoose');
const countrySchema = new mongoose.Schema({
  name: {
    type: 'string',
    unique:true,
  },
  countryCode:'string',
});

countrySchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('Duplicate Key for Country'));
  } else {
    next(error);
  }
});
module.exports = mongoose.model('Country', countrySchema);