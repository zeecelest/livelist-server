/* eslint-disable quotes */
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Lists Endpoint', function() {
  let db;

  before('make knex instance', () => {
    db = helpers.makeKnexInstance();
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  afterEach('cleanup', () => helpers.cleanTables(db));
  beforeEach('insert users, languages and words', () => {
    return helpers.seedUsers(db, helpers.makeUsersArray());
  });

  describe(`GET /api/lists`, () => {
    context(`Given no auth header`, () => {
      it(`responds with 401 Unauthorized`, () => {
        return supertest(app)
          .get('/api/lists')
          .expect(401, { error: `Missing bearer token` });
      });
    });
    context(`Given an invalid auth header`, () => {
      it(`responds 401 'Unauthorized request' when invalid JWT secret`, () => {
        const validUser = helpers.makeUsersArray()[0];
        const invalidSecret = 'bad-secret';
        return supertest(app)
          .get('/api/lists')
          .set(
            'Authorization',
            helpers.makeAuthHeader(validUser, invalidSecret)
          )
          .expect(401, { error: `Unauthorized request` });
      });
      it(`responds 401 'Unauthorized request' when invalid sub in payload`, () => {
        const invalidUser = { username: 'user-not-existy', id: 1 };
        return supertest(app)
          .get('/api/lists')
          .set('Authorization', helpers.makeAuthHeader(invalidUser))
          .expect(401, { error: `Unauthorized request` });
      });
    });

    context(`Given a valid auth header`, () => {
      it(`responds with 200 and the lists`, () => {
        const validUser = helpers.makeUsersArray()[0];
        return supertest(app)
          .get('/api/lists')
          .set('Authorization', helpers.makeAuthHeader(validUser))
          .expect(200);
      });
      it(`responds with 200 and the specified list`, () => {
        const validUser = helpers.makeUsersArray()[0];
        return supertest(app)
          .get('/api/lists?list_id=1')
          .set('Authorization', helpers.makeAuthHeader(validUser))
          .expect(200);
      });
    });
  });
});
