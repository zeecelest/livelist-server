const knex = require('knex');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * create a knex instance connected to postgres
 * @returns {knex instance}
 */
function makeKnexInstance() {
  return knex({
    client: 'pg',
    connection: process.env.TEST_DATABASE_URL
  });
}

/**
 * create a knex instance connected to postgres
 * @returns {array} of user objects
 */
function makeUsersArray() {
  return [
    {
      id: 1,
      username: 'test-user-1',
      name: 'Test user 1',
      password: 'password',
      state: 'CA',
      city: 'Los_Angeles'
    },
    {
      id: 2,
      username: 'test-user-2',
      name: 'Test user 2',
      password: 'password',
      state: 'CA',
      city: 'San_Francisco'
    }
  ];
}

function makeListsData() {
  return [
    {
      id: 1,
      name: 'happy unicorn time',
      tags: '#fuck',
      city: 'Los Angeles',
      state: 'CA',
      is_public: true
    },
    {
      id: 2,
      name: 'Saturday fun night',
      tags: '#nightoutyolo',
      city: 'Los Angeles - IE',
      state: 'CA',
      is_public: true
    },
    {
      id: 3,
      name: 'Weekday Routine',
      tags: '#nightout',
      city: 'NYC',
      state: 'NY',
      is_public: true
    }
  ];
}

function makeSpotsData() {
  return [
    {
      id: 2,
      name: 'Pinks Hot Dogs',
      tags: '#restaurant',
      address: '709 N La Brea Ave, 90038',
      city: 'Los Angeles',
      state: 'CA',
      lat: '5.032',
      lon: '20.6542'
    },
    {
      id: 3,
      name: 'Giggles Night Club',
      tags: '#nightout',
      address: '215 N Brand Blvd, 91203',
      city: 'Glendale',
      state: 'CA',
      lat: '33.0324',
      lon: '18.2664'
    },
    {
      id: 4,
      name: 'test',
      tags: null,
      address: '123 test lane',
      city: 'city',
      state: 'test state',
      lat: '123.423423',
      lon: '454.123'
    }
  ];
}

function makeUsersListData() {
  return [];
}
/**
 * generate fixtures of languages and words for a given user
 * @param {object} user - contains `id` property
 */

/**
 * make a bearer token with jwt for authorization header
 * @param {object} user - contains `id`, `username`
 * @param {string} secret - used to create the JWT
 * @returns {string} - for HTTP authorization header
 */
function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.username,
    algorithm: 'HS256'
  });
  return `Bearer ${token}`;
}

/**
 * remove data from tables and reset sequences for SERIAL id fields
 * @param {knex instance} db
 * @returns {Promise} - when tables are cleared
 */
function cleanTables(db) {
  return db.transaction((trx) =>
    trx
      .raw(
        `TRUNCATE
        "users",
        "lists",
        "spots",
        "users_lists",
        "liked_by",
        "visited_by"
        CASCADE
        `
      )
      .then(() =>
        Promise.all([
          trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('users_id_seq', 0)`),

          trx.raw(`ALTER SEQUENCE spots_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('spots_id_seq', 0)`),

          trx.raw(`ALTER SEQUENCE lists_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('lists_id_seq', 0)`)
        ])
      )
  );
}

/**
 * insert users into db with bcrypted passwords and update sequence
 * @param {knex instance} db
 * @param {array} users - array of user objects for insertion
 * @returns {Promise} - when users table seeded
 */
function seedUsers(db, users) {
  const preppedUsers = users.map((user) => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }));
  return db.transaction(async (trx) => {
    await trx.into('users').insert(preppedUsers);
    await trx.raw(`SELECT setval('users_id_seq', ?)`, [
      users[users.length - 1].id
    ]);
  });
}

function seedSpotsTable(db, spots) {
  return db.transaction(async (trx) => {
    await trx.into('spots').insert(spots);
    await trx.raw(`SELECT setval('spots_id_seq', ?)`, [
      spots[spots.length - 1].id
    ]);
  });
}

function seedListsTable(db, lists) {
  return db.transaction(async (trx) => {
    await trx.into('lists').insert(lists);
    await trx.raw(`SELECT setval('lists_id_seq', ?)`, [
      lists[lists.length - 1].id
    ]);
  });
}

function seedUsersSpotsLists(db) {
  return db.transaction(async () => {
    await seedUsers(db, makeUsersArray());
    await seedSpotsTable(db, makeSpotsData());
    await seedListsTable(db, makeListsData());
  });
}

/**
 * seed the databases with words and update sequence counter
 * @param {knex instance} db
 * @param {array} users - array of user objects for insertion
 * @param {array} languages - array of languages objects for insertion
 * @param {array} words - array of words objects for insertion
 * @returns {Promise} - when all tables seeded
 */

module.exports = {
  makeKnexInstance,
  makeUsersArray,
  makeAuthHeader,
  makeListsData,
  makeSpotsData,
  cleanTables,
  seedListsTable,
  seedSpotsTable,
  seedUsersSpotsLists,
  seedUsers
};
