const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers')

describe('proxy endpoints', function () {
  let db;
  const testUsers = helpers.makeUsersArray();
  const testUser = testUsers[0];

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });
    app.set('db', db)
  });

  after('disconnect from db', () => db.destroy());
  before('cleanup', () => helpers.cleanTables(db));
  afterEach('cleanup', () => helpers.cleanTables(db));

  describe('POST /api/proxy/foods', () => {
    context('with correct bearer token and valid meal_id', () => {
      it('responds 200 OK, and gets all ingredients from meal', () => {
        return supertest(app)
          .post('/api/proxy/foods')
          .set('Authorization', helpers.makeAuthHeader(testUser, process.env.JWT_SECRET))
          .send({food: 'peanut butter'})
          .expect(201)
          .expect(res => {
            expect(res.body[0].name).to.eql('peanut butter')
          })
      })
    })
    context('with correct bearer token and no food query', () => {
      it('responds 400 Bad Request, and sends valid error message', () => {
        return supertest(app)
          .post('/api/proxy/foods')
          .set('Authorization', helpers.makeAuthHeader(testUser, process.env.JWT_SECRET))
          .expect(400)
          .expect(res => {
            expect(res.body.error).to.eql('Missing food in request body.')
          })
      })
    })
    context('with correct bearer token and food query length is > 30', () => {
      it('responds 400 Bad Request, and sends valid error message', () => {
        return supertest(app)
          .post('/api/proxy/foods')
          .set('Authorization', helpers.makeAuthHeader(testUser, process.env.JWT_SECRET))
          .send({ food: 'abcdefghijklmnopqrstuvwxyzabcdef' })
          .expect(400)
          .expect(res => {
            expect(res.body.error).to.eql('Food names cannot exceed 30 characters.')
          })
        })
      })
      context('with correct bearer token and no valid results', () => {
        it('responds 400 Bad Request, and sends valid error message', () => {
          return supertest(app)
          .post('/api/proxy/foods')
          .set('Authorization', helpers.makeAuthHeader(testUser, process.env.JWT_SECRET))
          .send({ food: 'abcdefghijklmnopqrstuv' })
          .expect(400)
          .expect(res => {
            expect(res.body.error).to.eql('Sorry, we couldn\'t find any results matching your search')
          })
      })
    })
})
  describe.only('POST /api/proxy/nutrition', () => {
    context('with correct bearer token and valid foodId', () => {
      it('responds 200 OK, and gets all ingredients from meal', () => {
        // let ingredients = [{
        //   quantity: 1, 
        //   measureURI: "http://www.edamam.com/ontologies/edamam.owl#Measure_ounce", 
        //   foodId: 'food_b0bn6w4ab49t55b1o8jsnbq6nm2g'}]
        // // let body = { ingredients: ingredients, name:'banana', label: 'Ounce', quantity:8 }
        let body = {
          ingredients: [
              {
                  quantity: 8,
                  measureURI: "http://www.edamam.com/ontologies/edamam.owl#Measure_ounce",
                  foodId: "food_b0bn6w4ab49t55b1o8jsnbq6nm2g"
              }
          ],
          name: "banana",
          label: "Ounce",
          quantity: "1"
      }
        return supertest(app)
          .post('/api/proxy/nutrition')
          .set('Authorization', helpers.makeAuthHeader(testUser, process.env.JWT_SECRET))
          .send(body)
          .expect(201)
          .expect(res => {
            expect(res.body.name).to.eql(body.name)
          })
      })
    })
    context('with correct bearer token and no ingredients', () => {
      it('responds 400 Bad Request, and sends valid error message', () => {
        let body = { name:'peanut butter', label: 'Cup', quantity:1 }
        return supertest(app)
          .post('/api/proxy/nutrition')
          .set('Authorization', helpers.makeAuthHeader(testUser, process.env.JWT_SECRET))
          .send(body)
          .expect(400)
          .expect(res => {
            expect(res.body.error).to.eql('Missing ingredients in request body')
          })
      })
    })
    context('with correct bearer token and no name', () => {
      it('responds 400 Bad Request, and sends valid error message', () => {
        let ingredients = [{
          quantity: 1, measureURI: 'http://www.edamam.com/ontologies/edamam.owl#Measure_cup', foodId: 'food_aop5qt1bqbntvmbbvbxzaay2dwxo'
        }]
        let body = { ingredients, label: 'Cup', quantity: 1 }
        return supertest(app)
          .post('/api/proxy/nutrition')
          .set('Authorization', helpers.makeAuthHeader(testUser, process.env.JWT_SECRET))
          .send(body)
          .expect(400)
          .expect(res => {
            expect(res.body.error).to.eql('Missing name in request body')
          })
      })
    })
    context('with correct bearer token and no label', () => {
      it('responds 400 Bad Request, and sends valid error message', () => {
        let ingredients = [{
          quantity: 1, measureURI: 'http://www.edamam.com/ontologies/edamam.owl#Measure_cup', foodId: 'food_aop5qt1bqbntvmbbvbxzaay2dwxo'
        }]
        let body = { ingredients, name: 'peanut butter', quantity: 1 }
        return supertest(app)
          .post('/api/proxy/nutrition')
          .set('Authorization', helpers.makeAuthHeader(testUser, process.env.JWT_SECRET))
          .send(body)
          .expect(400)
          .expect(res => {
            expect(res.body.error).to.eql('Missing label in request body')
          })
      })
    })
    context('with correct bearer token and no quantity', () => {
      it('responds 400 Bad Request, and sends valid error message', () => {
        let ingredients = [{
          quantity: 1, measureURI: 'http://www.edamam.com/ontologies/edamam.owl#Measure_cup', foodId: 'food_aop5qt1bqbntvmbbvbxzaay2dwxo'
        }]
        let body = { ingredients, name: 'peanut butter', label: 'Cup', }
        return supertest(app)
          .post('/api/proxy/nutrition')
          .set('Authorization', helpers.makeAuthHeader(testUser, process.env.JWT_SECRET))
          .send(body)
          .expect(400)
          .expect(res => {
            expect(res.body.error).to.eql('Missing quantity in request body')
          })
      })
    })
  })
})