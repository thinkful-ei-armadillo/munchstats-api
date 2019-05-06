/* eslint-disable no-undef */
'use strict';

const jwt = require('jsonwebtoken');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe.only('Meals Endpoints', function () {
  let db;

  const testUsers = helpers.makeUsersArray();
  const testUser = testUsers[0];
  const testMeals = helpers.makeMealsArray();

  before('make knex instance', () => {
    db = helpers.makeKnexInstance();
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  afterEach('cleanup', () => helpers.cleanTables(db));

  describe('POST /meal', () => {
    beforeEach('insert things', () =>
      helpers.seedMealTables(
        db,
        testUsers,
        testMeals
      )
    );

    it('creates a meal, responding with 201', function () {
    //   this.retries(3);
      const testUser = testUsers[0];
      const newMeal = {
        user_id: testUser.id,
        name: 'test-event',
        total_calorie: 300,
        total_fat: 10,
        total_carbs: 20,
        total_protein: 30
      };
      return supertest(app)
        .post('/api/meal')
        .set('Authorization', helpers.makeAuthHeader(testUser, process.env.JWT_SECRET))
        .send(newMeal)
        .expect(201)
        .expect(res =>
          db
            .from('meal')
            .select('*')
            .where({
              id: res.body[0].id
            })
            .first()
            .then(row => {
              expect(row.name).to.eql(newMeal.name);
              expect(row.tag).to.eql(newMeal.tag);
              expect(row.calories).to.eql(newMeal.calories);
              expect(row.fat).to.eql(newMeal.fat);
              expect(row.carbs).to.eql(newMeal.carbs);
              expect(row.protein).to.eql(newMeal.protein);
              expect(row.user_id).to.eql(newMeal.user_id);
            })
        );
    });

  });
});