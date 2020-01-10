/* eslint-disable quotes */
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Lists Endpoint', function() {
  let db;
  const {
    makeKnexInstance,
    makeUsersArray,
    makeAuthHeader,
    makeListsData,
    makeSpotsData,
    cleanTables,
    seedUsers
  } = helpers;
  before('make knex instance', () => {
    let db = makeKnexInstance();
    app.set('db', db);
  });
  after('disconnect from db', () => db.destroy());
  before('cleanup', () => cleanTables(db));
  afterEach('cleanup', () => cleanTables(db));

  describe(`GET /api/lists`, () => {
    context(`Given no lists`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/lists')
          .expect(200, []);
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
