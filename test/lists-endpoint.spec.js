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
    });

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
