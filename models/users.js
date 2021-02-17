const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: 'string',
  surname: 'string',
  country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country' },
  birthday: 'Date'
});
module.exports = mongoose.model('User', userSchema);