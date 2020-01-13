/* eslint-disable quotes */
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Lists Endpoint', function() {
  let db;
  const validUser = helpers.makeUsersArray()[0];
  const invalidSecret = 'bad-secret';
  const bearerToken = helpers.makeAuthHeader(validUser);
  const invalidUser = { username: 'fakeyfakey', password: 'dookeydookey' };

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
        return supertest(app)
          .get('/api/lists')
          .set(
            'Authorization',
            helpers.makeAuthHeader(validUser, invalidSecret)
          )
          .expect(401, { error: `Unauthorized request` });
      });
      it(`responds 401 'Unauthorized request' when invalid sub in payload`, () => {
        return supertest(app)
          .get('/api/lists')
          .set('Authorization', helpers.makeAuthHeader(invalidUser))
          .expect(401, { error: `Unauthorized request` });
      });
    });

    context(`Given a valid auth header`, () => {
      it(`responds with 200 and the lists`, () => {
        return supertest(app)
          .get('/api/lists')
          .set('Authorization', bearerToken)
          .expect(200);
      });
      it(`responds with 200 and the specified list`, () => {
        setTimeout(() => {
          return supertest(app)
            .get('/api/lists/1')
            .set('Authorization', bearerToken)
            .expect(200, listOne);
        }, 2000);
      });
    });
  });

  describe(`POST /api/lists`, () => {
    context(`Given a valid auth header`, () => {
      let keys = ['city', 'state', 'name', 'is_public', 'tags'];
      for (let i = 0; i < keys.length - 1; i++) {
        it(`responds with 400 and the missing key : ${keys[i]}`, () => {
          let reqObj = {
            state: 'CA',
            city: 'Los_Angeles',
            tags: '#awesome',
            name: 'I made and edit on this name',
            is_public: true
          };
          delete reqObj[keys[i]];
          return supertest(app)
            .post('/api/lists')
            .send(reqObj)
            .set('Content-Type', 'application/json')
            .set('Authorization', bearerToken)
            .expect(400, { error: `Missing '${keys[i]}' in request body` });
        });
      }
    });
  });

  describe(`POST /api/lists?list_id=X`, () => {
    context(`Given a valid auth header`, () => {
      let keys = ['city', 'state', 'name', 'is_public', 'tags'];
      for (let i = 0; i < keys.length; i++) {
        it(`responds with 400 and the missing key : ${keys[i]}`, () => {
          let reqObj = {
            state: 'CA',
            city: 'Los_Angeles',
            tags: '#awesome',
            name: 'I made and edit on this name',
            is_public: true
          };
          delete reqObj[keys[i]];
          return supertest(app)
            .patch('/api/lists/1')
            .send(reqObj)
            .set('Content-Type', 'application/json')
            .set('Authorization', bearerToken)
            .expect(400, { error: `Missing '${keys[i]}' in request body` });
        });
      }
    });
  });

  describe(`DELETE /api/lists/X`, () => {
    context(`Given no auth header`, () => {
      it(`Responds with a 400 and Unauthorized`, () => {
        return (
          supertest(app)
            .delete('/api/lists/3')
            // .set('Authorization', helpers.makeAuthHeader(validUser))
            .expect(401, { error: 'Missing bearer token' })
        );
      });
    });
    context(`Given a valid auth header`, () => {
      it(`Responds with a 200`, () => {
        const validUser = helpers.makeUsersArray()[0];
        return supertest(app)
          .delete('/api/lists/3')
          .set('Authorization', helpers.makeAuthHeader(validUser))
          .expect(200);
      });
      it(`Responds with a 401 Not Found`, () => {
        const validUser = helpers.makeUsersArray()[0];
        return supertest(app)
          .delete('/api/lists/9999999')
          .set('Authorization', helpers.makeAuthHeader(validUser))
          .expect(200, { message: 'You dont have access' });
      });
    });
  });
});

let listOne = {
  /// if seed file is changed : dependant tests will fail. Highlight listOne and find out what the actual response obj is
  list_name: 'Date night',
  list_id: 1,
  tags: '#datenight',
  created_by: 'Dunder Mifflin Admin',
  spots: [
    {
      id: 1,
      name: 'Pinks Hot Dogs',
      tags: '#restaurant',
      address: '709 N La Brea Ave',
      city: 'CA',
      state: 'Los Angeles',
      lat: '34.083824',
      lng: '-118.344266'
    },
    {
      id: 2,
      name: 'Giggles Night Club',
      tags: '#nightout',
      address: '215 N Brand Blvd',
      city: 'CA',
      state: 'Los Angeles',
      lat: '34.032400',
      lng: '-118.324664'
    },
    {
      id: 3,
      name: 'Hickups',
      tags: '#cheap #tips',
      address: '215 N Brand Blvd',
      city: 'CA',
      state: 'Los Angeles',
      lat: '34.0324',
      lng: '-118.332664'
    },
    {
      id: 4,
      name: 'Giggles Night Club',
      tags: '#wine #beer',
      address: '18 N Brand Blvd',
      city: 'CA',
      state: 'Los Angeles',
      lat: '34.0324',
      lng: '-118.312664'
    },
    {
      id: 5,
      name: 'Marvel Museum',
      tags: '#views',
      address: '11 N Fake',
      city: 'CA',
      state: 'Los Angeles',
      lat: '34.0324',
      lng: '-118.325664'
    }
  ]
};
