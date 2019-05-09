const knex = require('knex')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// create a knex instance connected to postgres
function makeKnexInstance() {
  console.log(process.env.TEST_DB_URL);
  return knex({
    client: 'pg',
    connection: process.env.TEST_DB_URL,
  })
}

// creates an array of users for the tests
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

// creates an array of ingredients for the tests
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

// creates an array of meals for the tests
function makeMealsArray() {
  return [{
      id: 1,
      user_id: 1,
      name: 'test-breakfast',
      total_calorie: 500,
      total_fat: 15,
      total_carbs: 30,
      total_protein: 20
    },
    {
      id: 2,
      user_id: 1,
      name: 'test-lunch',
      total_calorie: 400,
      total_fat: 10,
      total_carbs: 40,
      total_protein: 25
    },
    {
      id: 3,
      user_id: 2,
      name: 'test-dinner',
      total_calorie: 600,
      total_fat: 20,
      total_carbs: 40,
      total_protein: 30
    },
    {
      id: 4,
      user_id: 1,
      name: 'test-brunch',
      total_calorie: 1000,
      total_fat: 40,
      total_carbs: 50,
      total_protein: 30
    }
  ]
}

// creates an array of events for the tests
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

// make a bearer token with jwt for authorization header
function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.username,
    algorithm: 'HS256',
  })
  return `Bearer ${token}`
}

// removes the data from the tables
function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        "events",
        "ingredients",
        "meal",
        "user"`
    )
    .then(() =>
      Promise.all([
        trx.raw(`ALTER SEQUENCE events_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE ingredients_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE meal_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE user_id_seq minvalue 0 START WITH 1`),
        trx.raw(`SELECT setval('events_id_seq', 10)`),
        trx.raw(`SELECT setval('ingredients_id_seq', 10)`),
        trx.raw(`SELECT setval('meal_id_seq', 10)`),
        trx.raw(`SELECT setval('user_id_seq', 10)`),
      ])
    )
  )
}

// inserts users into db with bcrypted passwords and update sequence
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

// seeds both the ingredients and meals tables for the ingredients endpoints tests
function seedIngredientsAndMeals(db, ingredients, meals) {
   return db.transaction(async trx => {
     await trx.into('meal').insert(meals)
     await trx.into('ingredients').insert(ingredients)
   })
}

// seeds both the users and meal tables for the meal endpoints tests
function seedMealTables(db, users, meals = []) {
  return seedUsers(db, users)
    .then(() =>
      db
      .into('meal')
      .insert(meals)
    )
}

// seeds both the users and events tables for the events endpoints tests
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
  makeMealsArray,
  makeEventsArray,
  makeAuthHeader,
  cleanTables,
  seedUsers,
  makeIngredientsArray,
  makeMealsArray,
  seedIngredientsAndMeals,
  seedMealTables,
  seedEventsTables
}
