const mongoose = require('mongoose');

function connect() {
  return new Promise((resolve, reject) => {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    };

    if(process.env.NODE_ENV === 'test') {
      const Mockgoose = require('mockgoose').Mockgoose;
      const dbMock = new Mockgoose(mongoose);
      dbMock.prepareStorage().then(() => mongoose.connect(process.env.DB_URI, options).then((res, err) => {
        if (err) return reject(err);
        resolve('MockGoose');
      }));
    }
    else {
      mongoose.connect(process.env.DB_URI, options).then((res, err) => {
        if (err) return reject(err);
        resolve('Production');
      })
    }
  });
}

function close(){
  return mongoose.disconnect();
}

module.exports = { connect, close };