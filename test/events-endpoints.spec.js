/* eslint-disable no-undef */
'use strict';

const jwt = require('jsonwebtoken');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Events Endpoints', function () {
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

    it('creates a event, responding with 201', function () {
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

  describe('DELETE /events', () => {
    beforeEach('insert things', () =>
      helpers.seedEventsTables(
        db,
        testUsers,
        testEvents
      )
    );

    const event = testEvents[0];

    it('deletes an event, responds with a 200 and the event it just deleted', function() {
      return supertest(app)
        .delete('/api/events')
        .set('Authorization', helpers.makeAuthHeader(testUser, process.env.JWT_SECRET))
        .send({event})
        .expect(200)
        .expect(res => {
          expect(res.body).to.have.property('id');
          expect(res.body.user_id).to.eql(event.user_id);
          expect(res.body.name).to.eql(event.name);
          expect(res.body.date).to.eql(event.date);
          expect(res.body.tag).to.eql(event.tag);
          expect(res.body.calories).to.eql(event.calories);
          expect(res.body.fat).to.eql(event.fat);
          expect(res.body.carbs).to.eql(event.carbs);
          expect(res.body.protein).to.eql(event.protein);
        });
    });
  });

  describe('POST /events/date', () => {
    beforeEach('insert things', () =>
      helpers.seedEventsTables(
        db,
        testUsers,
        testEvents
      )
    );

    it('finds a group of events in a given range of dates, returns a 200, and the events in that range', function() {
      const start = '2019-05-05 08:00:00';
      const end = '2019-05-05 22:00:00';
      const range = { start , end };
      const cinco = testEvents[3];

      return supertest(app)
        .post('/api/events/date')
        .set('Authorization', helpers.makeAuthHeader(testUser, process.env.JWT_SECRET))
        .send(range)
        .expect(200)
        .expect(res => {
          for(let i = 0; i < res.length; i++) {
            expect(res.body[i]).to.have.property('id');
            expect(res.body[i].user_id).to.eql(cinco.user_id);
            expect(res.body[i].name).to.eql(cinco.name);
            expect(res.body[i].date).to.eql(cinco.date);
            expect(res.body[i].tag).to.eql(cinco.tag);
            expect(res.body[i].calories).to.eql(cinco.calories);
            expect(res.body[i].fat).to.eql(cinco.fat);
            expect(res.body[i].carbs).to.eql(cinco.carbs);
            expect(res.body[i].protein).to.eql(cinco.protein);
          }
        });
    });

    const requiredFields = ['start', 'end'];

    requiredFields.forEach(field => {
      const start = '2019-05-05 08:00:00';
      const end = '2019-05-05 22:00:00';
      const range = { start, end };

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        if(field === 'start') {
          delete range.start;
        }
        if(field === 'end') {
          delete range.end;
        }
        return supertest(app)
          .post('/api/events/date')
          .set('Authorization', helpers.makeAuthHeader(testUser, process.env.JWT_SECRET))
          .send(range)
          .expect(400, {
            error: `Missing '${field}' in request body`,
          });
      });
    });

    it('returns a 404 when there are no events in a given range', function() {
      const start = '2017-05-05 08:00:00';
      const end = '2017-05-15 22:00:00';
      const range = { start , end };

      return supertest(app)
        .post('/api/events/date')
        .set('Authorization', helpers.makeAuthHeader(testUser, process.env.JWT_SECRET))
        .send(range)
        .expect(404, {
          error: {
            message: 'No events found in that date range'
          },
        });
    });
  });
  
});