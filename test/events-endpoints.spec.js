/* eslint-disable no-undef */
'use strict';

const jwt = require('jsonwebtoken');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe.only('Events Endpoints', function () {
  let db;

  const testUsers = helpers.makeUsersArray();
  const testUser = testUsers[0];
  const testEvents = helpers.makeEventsArray();

  before('make knex instance', () => {
    db = helpers.makeKnexInstance();
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  afterEach('cleanup', () => helpers.cleanTables(db));

  describe('POST /events', () => {
    beforeEach('insert things', () =>
      helpers.seedEventsTables(
        db,
        testUsers,
        testEvents
      )
    );

    it('creates a event, responding with 201 and the new event', function () {
    //   this.retries(3);
      const testUser = testUsers[0];
      const newEvent = {
        id: 5,
        user_id: testUser.id,
        name: 'test-event',
        tag: 'breakfast',
        calories: 300,
        fat: 10,
        carbs: 20,
        protein: 30
      };
      return supertest(app)
        .post('/api/events')
        .set('Authorization', helpers.makeAuthHeader(testUser, process.env.JWT_SECRET))
        .send(newEvent)
        .expect(201)
        .expect(res =>
          db
            .from('events')
            .select('*')
            .where({
              id: res.body[0].id
            })
            .first()
            .then(row => {
              expect(row.name).to.eql(newEvent.name);
              expect(row.tag).to.eql(newEvent.tag);
              expect(row.calories).to.eql(newEvent.calories);
              expect(row.fat).to.eql(newEvent.fat);
              expect(row.carbs).to.eql(newEvent.carbs);
              expect(row.protein).to.eql(newEvent.protein);
              expect(row.user_id).to.eql(newEvent.user_id);
            })
        );
    });

    const requiredFields = ['name'];

    requiredFields.forEach(field => {
      const testUser = testUsers[0];
      const newEvent = {
        user_id: testUser.id,
        name: 'test-event',
        tag: 'breakfast',
        calories: 300,
        fat: 10,
        carbs: 20,
        protein: 30
      };

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newEvent[field];

        return supertest(app)
          .post('/api/events')
          .set('Authorization', helpers.makeAuthHeader(testUser, process.env.JWT_SECRET))
          .send(newEvent)
          .expect(400, {
            error: `Missing '${field}' in request body`,
          });
      });
    });
  });
});