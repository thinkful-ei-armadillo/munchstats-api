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
    const requiredFields = ['name'];

    requiredFields.forEach(field => {
      const testUser = testUsers[0];
      const newMeal = {
        user_id: testUser.id,
        name: 'test-event',
        total_calorie: 300,
        total_fat: 10,
        total_carbs: 20,
        total_protein: 30
      };

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newMeal[field];

        return supertest(app)
          .post('/api/meal')
          .set('Authorization', helpers.makeAuthHeader(testUser, process.env.JWT_SECRET))
          .send(newMeal)
          .expect(400, {
            error: `Missing '${field}' in request body`,
          });
      });
    });
  });

  describe('DELETE /meal', () => {
    beforeEach('insert things', () =>
      helpers.seedMealTables(
        db,
        testUsers,
        testMeals
      )
    );

    const meal = testMeals[0];

    it('deletes an meal, responds with a 200 and the meal it just deleted', function() {
      return supertest(app)
        .delete('/api/meal')
        .set('Authorization', helpers.makeAuthHeader(testUser, process.env.JWT_SECRET))
        .send({meal})
        .expect(200)
        .expect(res => {
          expect(res.body).to.have.property('id');
          expect(res.body.user_id).to.eql(meal.user_id);
          expect(res.body.name).to.eql(meal.name);
          expect(res.body.total_calorie).to.eql(meal.total_calorie);
          expect(res.body.total_fat).to.eql(meal.total_fat);
          expect(res.body.total_carbs).to.eql(meal.total_carbs);
          expect(res.body.total_protein).to.eql(meal.total_protein);
        });
    });
  });

  describe('PATCH /meal', () => {
    beforeEach('insert things', () =>
      helpers.seedMealTables(
        db,
        testUsers,
        testMeals
      )
    );
    const testUser = testUsers[0];
    const updateMeal = {
      id: 1, 
      user_id: testUser.id,
      name: 'updated-test-event',
      total_calorie: 500,
      total_fat: 20,
      total_carbs: 30,
      total_protein: 40
    };

    it('updates a meal, responds with a 200 and the meal it just updated', function() {
      return supertest(app)
        .patch('/api/meal')
        .set('Authorization', helpers.makeAuthHeader(testUser, process.env.JWT_SECRET))
        .send(updateMeal)
        .expect(200)
        .expect(res => {
          expect(res.body).to.have.property('id');
          expect(res.body.user_id).to.eql(updateMeal.user_id);
          expect(res.body.name).to.eql(updateMeal.name);
          expect(res.body.total_calorie).to.eql(updateMeal.total_calorie);
          expect(res.body.total_fat).to.eql(updateMeal.total_fat);
          expect(res.body.total_carbs).to.eql(updateMeal.total_carbs);
          expect(res.body.total_protein).to.eql(updateMeal.total_protein);
        });
    });
  });
});