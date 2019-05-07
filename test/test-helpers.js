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
      calorieBudget: 2000,
      fatBudget: 100,
      carbBudget: 100,
      proteinBudget:100
    },
    {
      id: 2,
      username: 'test-user-2',
      name: 'Test user 2',
      password: 'password',
      calorieBudget: 2000,
      fatBudget: 100,
      carbBudget: 100,
      proteinBudget: 100
    },
  ]
}

function makeMealsArray() {
  return [
    {
      id: 1,
      name: 'test meal 1',
      user_id: 1
    },
    {
      id: 2,
      name: 'test meal 2',
      user_id: 1
    }
  ]
}
function makeIngredientsArray() {
  return [
    {
      id: 1,
      name: 'Test ingredient 1',
      meal_id: 1,
      total_calorie: 55,
      total_fat: 10,
      total_carbs: 1,
      total_protein: 2,
      amount:1,
      unit:'kg'
    },
    {
      id: 2,
      name: 'Test ingredient 2',
      meal_id: 1,
      total_calorie: 432,
      total_fat: 50,
      total_carbs: 0,
      total_protein: 10,
      amount: 10,
      unit: 'ounces'
    },
    {
      id: 3,
      name: 'Test ingredient 3',
      meal_id: 1,
      total_calorie: 111,
      total_fat: 0,
      total_carbs: 100,
      total_protein: 100,
      amount: 1,
      unit: 'serving'
    },
    {
      id: 4,
      name: 'Test ingredient 4',
      meal_id: 2,
      total_calorie: 562,
      total_fat: 50,
      total_carbs: 120,
      total_protein: 70,
      amount: 4,
      unit: 'pounds'
    },
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
 * remove data from tables and reset sequences for SERIAL id fields
 * @param {knex instance} db
 * @returns {Promise} - when tables are cleared
 */
function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        "events",
        "ingredients",
        "meal",
        "user"`
      )
      // .then(() =>
      //   Promise.all([
      //     trx.raw(`ALTER SEQUENCE word_id_seq minvalue 0 START WITH 1`),
      //     trx.raw(`ALTER SEQUENCE language_id_seq minvalue 0 START WITH 1`),
      //     trx.raw(`ALTER SEQUENCE user_id_seq minvalue 0 START WITH 1`),
      //     trx.raw(`SELECT setval('word_id_seq', 0)`),
      //     trx.raw(`SELECT setval('language_id_seq', 0)`),
      //     trx.raw(`SELECT setval('user_id_seq', 0)`),
      //   ])
      // )
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

function seedIngredientsAndMeals(db, ingredients, meals) {
   return db.transaction(async trx => {
     await trx.into('meal').insert(meals)
     await trx.into('ingredients').insert(ingredients)
   })
}

module.exports = {
  makeKnexInstance,
  makeUsersArray,
  makeAuthHeader,
  cleanTables,
  seedUsers,
  makeIngredientsArray,
  makeMealsArray,
  seedIngredientsAndMeals
}
