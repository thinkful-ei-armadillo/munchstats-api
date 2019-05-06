const knex = require('knex')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

/**
 * create a knex instance connected to postgres
 * @returns {knex instance}
 */
function makeKnexInstance() {
  return knex({
    client: 'pg',
    connection: process.env.TEST_DB_URL,
  })
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
    },
    {
      id: 2,
      username: 'test-user-2',
      name: 'Test user 2',
      password: 'password',
    },
  ]
}

function makeEventsArray() {
  return [{
      id: 1,
      user_id: 1,
      name: 'test-breakfast',
      date: '2019-05-06 09:00:00',
      tag: 'breakfast',
      calories: 500,
      fat: 15,
      carbs: 30,
      protein: 20
    },
    {
      id: 2,
      user_id: 1,
      name: 'test-lunch',
      date: '2019-05-06 12:00:00',
      tag: 'lunch',
      calories: 600,
      fat: 5,
      carbs: 35,
      protein: 30
    },
    {
      id: 3,
      user_id: 1,
      name: 'test-dinner',
      date: '2019-05-06 18:00:00',
      tag: 'dinner',
      calories: 600,
      fat: 25,
      carbs: 50,
      protein: 35
    },
    {
      id: 4,
      user_id: 1,
      name: 'test-brunch',
      date: '2019-05-05 11:00:00',
      tag: 'dinner',
      calories: 1000,
      fat: 40,
      carbs: 60,
      protein: 50
    }
  ]
}

/**
 * make a bearer token with jwt for authorization header
 * @param {object} user - contains `id`, `username`
 * @param {string} secret - used to create the JWT
 * @returns {string} - for HTTP authorization header
 */
function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.username,
    algorithm: 'HS256',
  })
  return `Bearer ${token}`
}

/**
 * remove data from tables
 * @param {knex instance} db
 */
function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        "meal",
        "ingredients",
        "user",
        "events"`
      )
  )
}

/**
 * insert users into db with bcrypted passwords and update sequence
 * @param {knex instance} db
 * @param {array} users - array of user objects for insertion
 * @returns {Promise} - when users table seeded
 */
function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.transaction(async trx => {
    await trx.into('user').insert(preppedUsers)

    await trx.raw(
      `SELECT setval('user_id_seq', ?)`,
      [users[users.length - 1].id],
    )
  })
}

function seedEventsTables(db, users, events = []) {
  return seedUsers(db, users)
    .then(() =>
      db
      .into('events')
      .insert(events)
    )
}

module.exports = {
  makeKnexInstance,
  makeUsersArray,
  makeEventsArray,
  makeAuthHeader,
  cleanTables,
  seedUsers,
  seedEventsTables
}
