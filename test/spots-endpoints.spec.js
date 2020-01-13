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
      it(`Responds with 200 and the specified list`, () => {
        return supertest(app)
          .get('/api/spots/1')
          .set('Authorization', bearerToken)
          .expect(200, {
            id: 1,
            name: 'Pinks Hot Dogs',
            tags: '#restaurant',
            address: '709 N La Brea Ave, 90038',
            city: 'Los Angeles',
            state: 'CA',
            lat: '5.032',
            lon: '20.6542'
          });
      });
    });
  });

  describe(`PATCH api/spots/1`, () => {
    context(`Given insufficent keys in request body`, () => {
      const keys = [
        'name',
        'address',
        'city',
        'state',
        'lat',
        'lon',
        'id',
        'tags'
      ];
      for (let i = 0; i < keys.length - 1; i++) {
        it(`responds with a 400 and the missing key : ${keys[i]}`, () => {
          let reqObj = {
            name: 'test name',
            address: '123 test lane',
            city: 'test city',
            state: 'test state',
            lat: 123,
            lon: 123,
            tags: '#testing'
          };
          delete reqObj[keys[i]];
          setTimeout(() => {
            return supertest(app)
              .patch('/api/spots/1')
              .send(reqObj)
              .set('Content-Type', 'application/json')
              .set('Authorization', bearerToken)
              .expect(400, { error: `Missing '${keys[i]}' in request body` });
          }, 2000);
        });
      }
    });
  });

  describe(`POST api/spots/1`, () => {
    context(`Given insufficent keys in request body`, () => {
      const keys = [
        'name',
        'address',
        'city',
        'state',
        'lat',
        'lon',
        'id',
        'tags'
      ];
      for (let i = 0; i < keys.length - 1; i++) {
        it(`responds with a 400 and the missing key : ${keys[i]}`, () => {
          let reqObj = {
            name: 'test name',
            address: '123 test lane',
            city: 'test city',
            state: 'test state',
            lat: 123,
            lon: 123,
            tags: '#testing'
          };
          delete reqObj[keys[i]];
          setTimeout(() => {
            return supertest(app)
              .post('/api/spots/1')
              .send(reqObj)
              .set('Content-Type', 'application/json')
              .set('Authorization', bearerToken)
              .expect(400, { error: `Missing '${keys[i]}' in request body` });
          }, 2000);
        });
      }
    });
  });

  describe(`DELETE api/spots/1`, () => {
    context(`Given an existing id`, () => {
      it(`responds with 200`, () => {
        return supertest(app)
          .delete('/api/spots/1')
          .set('Authorization', bearerToken)
          .expect(200);
      });
    });
  });
});
