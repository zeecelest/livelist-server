/* eslint-disable quotes */
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Spots Endpoint', function() {
  let db;
  const invalidUser = { username: 'user-not-existy', id: 1 };
  const validUser = helpers.makeUsersArray()[0];
  const invalidSecret = 'bad-secret';
  const bearerToken = helpers.makeAuthHeader(validUser);
  before('make knex instance', () => {
    db = helpers.makeKnexInstance();
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  afterEach('cleanup', () => helpers.cleanTables(db));

  beforeEach('insert users, languages and words', async () => {
    return await helpers.seedUsersSpotsLists(db);
  });
  describe(`GET api/spots`, () => {
    context(`Given no auth header`, () => {
      it(`responds with 401 Unauthorized`, () => {
        return supertest(app)
          .get('/api/spots')
          .expect(401, { error: `Missing bearer token` });
      });
    });
    context(`Given an invalid auth header`, () => {
      it(`responds 401 'Unauthorized request' when invalid JWT secret`, () => {
        return supertest(app)
          .get('/api/spots')
          .set(
            'Authorization',
            helpers.makeAuthHeader(validUser, invalidSecret)
          )
          .expect(401, { error: `Unauthorized request` });
      });
      it(`responds 401 'Unauthorized request' when invalid sub in payload`, () => {
        return supertest(app)
          .get('/api/spots')
          .set('Authorization', helpers.makeAuthHeader(invalidUser))
          .expect(401, { error: `Unauthorized request` });
      });
    });
    context(`Given a valid auth header`, () => {
      it(`Responds with 200 and a list of spots`, () => {
        return supertest(app)
          .get('/api/spots')
          .set('Authorization', bearerToken)
          .expect(200);
      });
    });
  });
});
