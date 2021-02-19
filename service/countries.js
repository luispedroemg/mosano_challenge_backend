const Country = require('../models/countries');

async function getCountries({countryCode=undefined, name=undefined, _id=undefined} = {}, {limit = 10,  page=0, sort = {name:1}} = {}){
  const filter = {};
  if(countryCode) query.countryCode = countryCode;
  if(name) query.name = name;
  if(_id) query._id = _id;

  return Country.find(filter)
    .sort(sort)
    .skip(limit*page)
    .limit(limit)
    .lean()
    .exec();
}

async function getCountryByCode(countryCode){
  const result = await Country.findOne({countryCode}).exec();
  if(!result) return Promise.reject({error:'service', message:'Country not found'});
  return new Promise((resolve) => resolve(result));
}

async function updateCountry(countryCode, {countryName = undefined, newCountryCode=undefined} = {}){
  if(!countryName && !newCountryCode) return Promise.reject({error:'service', message:'Invalid country data -> undefined parameters'});
  const updateCountry = {};
  if(countryName)  updateCountry.name = countryName;
  if(newCountryCode) updateCountry.countryCode = newCountryCode;

  const oldCountry = await Country.findOneAndUpdate({countryCode: countryCode}, updateCountry).lean().exec();
  const newCountry = await Country.findOne({_id:oldCountry._id}).lean().exec();
  if(!oldCountry || !newCountry) return Promise.reject({error:'service', message:'Something broke.'});
  return new Promise((resolve) => resolve({oldCountry, newCountry}));
}

async function createCountry({countryCode=undefined, countryName=undefined} = {}) {
  if(!countryCode || !countryName) return Promise.reject({error:'service', message:'Invalid country data -> undefined parameters'});
  const newCountry = new Country({name: countryName, countryCode: countryCode})
  return newCountry.save();
}

async function deleteCountry(countryCode=undefined){
  if(!countryCode) return Promise.reject({error:'service', message:'Invalid countryCode -> undefined parameters'});
  const result = await Country.findOneAndDelete({countryCode}).exec();
  if(!result) return Promise.reject({error:'service', message:'Country not found'});
  return new Promise((resolve) => resolve(result));
}

module.exports = { getCountries, getCountryByCode, updateCountry, createCountry, deleteCountry };