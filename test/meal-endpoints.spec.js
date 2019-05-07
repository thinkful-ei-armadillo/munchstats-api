/* eslint-disable no-undef */
'use strict';

const jwt = require('jsonwebtoken');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Meals Endpoints', function () {
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

  describe.skip('PATCH /meal', () => {
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

  describe('GET /meal', () => {
    beforeEach('insert things', () =>
      helpers.seedMealTables(
        db,
        testUsers,
        testMeals
      )
    );
    const testUser = testUsers[0];
    const userMeals = [ testMeals[0], testMeals[1], testMeals[3] ];
    it('gets all of the user meals, a 200 response and the list of meals', function() {
      return supertest(app)
        .get('/api/meal')
        .set('Authorization', helpers.makeAuthHeader(testUser, process.env.JWT_SECRET))
        .expect(200)
        .expect(res => {
          expect(res.body.length === userMeals.length);
          for(let i = 0; i < res.length; i++) {
            expect(res.body[i]).to.have.property('id');
            expect(res.body[i].user_id).to.eql(userMeals[i].user_id);
            expect(res.body[i].name).to.eql(userMeals[i].name);
            expect(res.body[i].date).to.eql(userMeals[i].date);
            expect(res.body[i].tag).to.eql(userMeals[i].tag);
            expect(res.body[i].calories).to.eql(userMeals[i].calories);
            expect(res.body[i].fat).to.eql(userMeals[i].fat);
            expect(res.body[i].carbs).to.eql(userMeals[i].carbs);
            expect(res.body[i].protein).to.eql(userMeals[i].protein);
          }
        });
    });
  });

  describe('GET /meal/:mealId', () => {
    beforeEach('insert things', () =>
      helpers.seedMealTables(
        db,
        testUsers,
        testMeals
      )
    );
    const testUser = testUsers[0];
    const meal1 = testMeals[0];
    it('gets the user meal by id, returns a 200 and the meal', function() {
      return supertest(app)
        .get(`/api/meal/${meal1.id}`)
        .set('Authorization', helpers.makeAuthHeader(testUser, process.env.JWT_SECRET))
        .expect(200)
        .expect(res => {
          expect(res.body[0]).to.have.property('id');
          expect(res.body[0].user_id).to.eql(testUser.id);
          expect(res.body[0].name).to.eql(meal1.name);
          expect(res.body[0].date).to.eql(meal1.date);
          expect(res.body[0].tag).to.eql(meal1.tag);
          expect(res.body[0].calories).to.eql(meal1.calories);
          expect(res.body[0].fat).to.eql(meal1.fat);
          expect(res.body[0].carbs).to.eql(meal1.carbs);
          expect(res.body[0].protein).to.eql(meal1.protein);
        });
    });
    it('tries to look an id that does not exist, returns a 404', function() {
      return supertest(app)
        .get('/api/meal/99999')
        .set('Authorization', helpers.makeAuthHeader(testUser, process.env.JWT_SECRET))
        .expect(404, {
          error: { message : 'Meal not found'}
        });
    });
  });
});