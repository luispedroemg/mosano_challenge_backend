const User = require('../models/users');
const Country = require('../models/countries');

async function createUser({name, surname, birthday, countryCode} = undefined) {
  if(!name || !surname || !birthday || !countryCode) return Promise.reject({error:'service', message:'Invalid country data -> undefined parameters'});
  try {
    const country = await Country.findOne({countryCode}).lean().exec();
    if(!country) return Promise.reject({error:'service', message:'Invalid countryCode: ' + countryCode});
    const newUser = new User({name, surname, birthday, country: country._id})
    const result = await newUser.save();
    return User.findOne({_id: result._id}).populate('country').exec();
  }catch(e){
    return Promise.reject(e);
  }
}

async function getUsers({name=undefined, surname=undefined, birthday=undefined, _id=undefined} = {}, {limit = 10,  page=0, sort = {name:1}} = {}){
  const filter = {};
  if(surname) query.surname = surname;
  if(name) query.name = name;
  if(birthday) query.birthday = birthday;
  if(_id) query._id = _id;

  return User.find(filter)
    .sort(sort)
    .skip(limit*page)
    .limit(limit)
    .lean()
    .exec();
}

async function getUserById(id){
  const result = await User.findOne({_id: id}).lean().exec();
  if(!result) return Promise.reject({error:'service', message:'User not found'});
  return new Promise((resolve) => resolve(result));
}

async function updateUser(id, {name = undefined, surname=undefined, birthday=undefined, countryCode=undefined} = {}){
  if(!name && !surname && !birthday && !countryCode) return Promise.reject({error:'service', message:'Invalid country data -> undefined parameters'});
  const updateUser = {};
  if(name)  updateUser.name = name;
  if(surname) updateUser.surname = surname;
  if(birthday) updateUser.birthday = birthday;
  try{
    if(countryCode){
      const country = await Country.findOne({countryCode}).lean().exec();
      if(!country) return Promise.reject({error:'service', message:'Invalid countryCode: ' + countryCode});
      updateUser.country = country._id;
    }
    const oldUser = await User.findOneAndUpdate({_id: id}, updateUser).populate('country').lean().exec();
    const newUser = await User.findOne({_id:id}).populate('country').lean().exec();
    if(!oldUser || !newUser) return Promise.reject({error:'service', message:'Something broke.'});
    return new Promise((resolve) => resolve({oldUser, newUser}));
  }catch(e){
    return Promise.reject({error:'service', message:e.message});
  }
}

async function deleteUser(id=undefined){
  if(!id) return Promise.reject({error:'service', message:'Invalid id -> undefined parameters'});
  const result = await User.findOneAndDelete({_id:id}).exec();
  if(!result) return Promise.reject({error:'service', message:'User not found'});
  return new Promise((resolve) => resolve(result));
}

module.exports = { createUser, getUsers, getUserById, updateUser, deleteUser };