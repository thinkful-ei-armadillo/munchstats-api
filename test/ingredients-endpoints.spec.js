const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers')

describe('ingredients endpoints', function() {
  let db;
  const testUsers = helpers.makeUsersArray();
  const testUser = testUsers[0];
  const testIngredients = helpers.makeIngredientsArray();
  const testMeals = helpers.makeMealsArray();

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection:process.env.TEST_DB_URL
    });
    app.set('db', db)
  });

  after('disconnect from db', () => db.destroy()); 
  before('cleanup', () => helpers.cleanTables(db));
  afterEach('cleanup', () => helpers.cleanTables(db));

  describe('POST /api/ingredients', () => {
    beforeEach('insert users', () => helpers.seedUsers(db, testUsers));
    beforeEach('insert meals and ingredients', () => helpers.seedIngredientsAndMeals(db, testIngredients, testMeals));
    context('with correct bearer token and valid meal_id', () => {
      it('responds 200 OK, and gets all ingredients from meal', () => {
        return supertest(app)
          .post('/api/ingredients')
          .set('Authorization', helpers.makeAuthHeader(testUser, process.env.JWT_SECRET))
          .send({meal:{id:2}})
          .expect(200)
          .expect(res => {
            const { ingredients } = res.body
            expect(ingredients[0]).to.eql(testIngredients[3])
          })
      })
    })
    context('with correct bearer token and valid meal_id', () => {
      it('responds 404 Not Found, and sends and error message', () => {
        return supertest(app)
          .post('/api/ingredients')
          .set('Authorization', helpers.makeAuthHeader(testUser, process.env.JWT_SECRET))
          .send({ meal: { id: 3 } })
          .expect(204)
      })
    })
  })


  describe('DELETE /api/ingredients', () => { // <----- what sad path to add?
    beforeEach('insert users', () => helpers.seedUsers(db, testUsers));
    beforeEach('insert meals and ingredients', () => helpers.seedIngredientsAndMeals(db, testIngredients, testMeals));
    context('with correct bearer token and valid ingredient', () => {
      it('responds 200 OK', () => {
        return supertest(app)
          .delete('/api/ingredients')
          .set('Authorization', helpers.makeAuthHeader(testUser, process.env.JWT_SECRET))
          .send({ ingredient_id: 2 })
          .expect(200)
          .expect(res => {
            expect(res.body).to.eql(2)
          })
      })
    })
  })
  describe('POST /api/ingredients/:meal_id', () => { // <----- what sad path to add?
    beforeEach('insert users', () => helpers.seedUsers(db, testUsers));
    beforeEach('insert meals and ingredients', () => helpers.seedIngredientsAndMeals(db, [], testMeals));
    context('with correct bearer token and valid ingredient', () => {
      it('responds 200 OK', () => {
        return supertest(app)
          .delete('/api/ingredients')
          .set('Authorization', helpers.makeAuthHeader(testUser, process.env.JWT_SECRET))
          .send({ ingredient_id: 2 })
          .expect(200)
          .expect(res => {
            expect(res.body).to.eql(2)
          })
      })
    })
  })
})
