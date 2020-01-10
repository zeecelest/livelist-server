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

  describe(`GET /api/lists`, () => {
    context(`Given no auth header`, () => {
      it(`responds with 401 Unauthorized`, () => {
        return supertest(app)
          .get('/api/lists')
          .expect(401, { error: `Missing bearer token` });
      });
      //   it(`responds 401 'Unauthorized request' when invalid JWT secret`, () => {
      //     const validUser = helpers.makeUsersArray()[0];
      //     console.log(validUser);
      //     const invalidSecret = 'bad-secret';
      //     return supertest(app)
      //       .get('/api/lists')
      //       .set(
      //         'Authorization',
      //         helpers.makeAuthHeader(validUser, invalidSecret)
      //       )
      //       .expect(401, { error: `Unauthorized request` });
      //   });
      //   it(`responds 401 'Unauthorized request' when invalid sub in payload`, () => {
      //     const invalidUser = { user_name: 'user-not-existy', id: 1 };
      //     return supertest(app)
      //       .get('/api/lists')
      //       .set('Authorization', helpers.makeAuthHeader(invalidUser))
      //       .expect(401, { error: `Unauthorized request` });
      //   });
      // });

      // context(`Given Auth header`, () => {
      //   it(`respongs with 200 and the lists`, () => {
      //     return supertest(app)
      //       .get('/api/lists')
      //       .expect(200, { error: `Missing bearer token` });
      //   });
      // });

      // context('Given there are lists in the database', () => {
      //   beforeEach('insert lists', () =>
      //     helpers.seedlistsTables(db, testUsers, testlists, testComments)
      //   );

      //   it('responds with 200 and all of the lists', () => {
      //     const expectedlists = testlists.map((article) =>
      //       helpers.makeExpectedArticle(testUsers, article, testComments)
      //     );
      //     return supertest(app)
      //       .get('/api/lists')
      //       .expect(200, expectedlists);
      //   });
      // });
    });
  });
});
