process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../../app');
const db = require('../../db');

describe('POST /users', function() {
  before((done) => {
    db.connect().then(() => done()).catch((err) => done(err));
  })

  after((done) => {
    db.close().then(() => done()).catch((err) => done(err));
  })

  it('Responds 400', function(done) {
    request(app)
      .post('/users')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400, done);
  });
});