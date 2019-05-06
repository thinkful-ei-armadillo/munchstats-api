'use strict';
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('User Endpoints', function () {
  let db;

  const testUsers = helpers.makeUsersArray();
  const testUser = testUsers[0];

  before('make knex instance', () => {
    db = helpers.makeKnexInstance();
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  afterEach('cleanup', () => helpers.cleanTables(db));

  /**
   * @description Register a user and populate their fields
   **/
  describe('POST /api/user', () => {
    beforeEach('insert users', () => helpers.seedUsers(db, testUsers));

    const requiredFields = ['username', 'password', 'name'];

    requiredFields.forEach(field => {
      const registerAttemptBody = {
        username: 'test username',
        password: 'test password',
        name: 'test name',
      };

      it(`responds with 400 required error when '${field}' is missing`, () => {
        delete registerAttemptBody[field];

        return supertest(app)
          .post('/api/user')
          .send(registerAttemptBody)
          .expect(400, {
            error: `Missing '${field}' in request body`,
          });
      });
    });

    it('responds 400 \'Password be longer than 8 characters\' when empty password', () => {
      const userShortPassword = {
        username: 'test username',
        password: '1234567',
        name: 'test name',
      };
      return supertest(app)
        .post('/api/user')
        .send(userShortPassword)
        .expect(400, { error: 'Password be longer than 8 characters' });
    });

    it('responds 400 \'Password be less than 72 characters\' when long password', () => {
      const userLongPassword = {
        username: 'test username',
        password: '*'.repeat(73),
        name: 'test name',
      };
      return supertest(app)
        .post('/api/user')
        .send(userLongPassword)
        .expect(400, { error: 'Password be less than 72 characters' });
    });

    it('responds 400 error when password starts with spaces', () => {
      const userPasswordStartsSpaces = {
        username: 'test username',
        password: ' 1Aa!2Bb@',
        name: 'test name',
      };
      return supertest(app)
        .post('/api/user')
        .send(userPasswordStartsSpaces)
        .expect(400, { error: 'Password must not start or end with empty spaces' });
    });

    it('responds 400 error when password ends with spaces', () => {
      const userPasswordEndsSpaces = {
        username: 'test username',
        password: '1Aa!2Bb@ ',
        name: 'test name',
      };
      return supertest(app)
        .post('/api/user')
        .send(userPasswordEndsSpaces)
        .expect(400, { error: 'Password must not start or end with empty spaces' });
    });

    it('responds 400 \'User name already taken\' when username isn\'t unique', () => {
      const duplicateUser = {
        username: testUser.username,
        password: '11AAaa!!',
        name: 'test name',
      };
      return supertest(app)
        .post('/api/user')
        .send(duplicateUser)
        .expect(400, { error: 'Username already taken' });
    });

    describe('Given a valid user', () => {
      it('responds 201, serialized user with no password', () => {
        const newUser = {
          username: 'test username',
          password: '11AAaa!!',
          name: 'test name',
        };
        return supertest(app)
          .post('/api/user')
          .send(newUser)
          .expect(201)
          .expect(res => {
            expect(res.body).to.have.property('id');
            expect(res.body.username).to.eql(newUser.username);
            expect(res.body.name).to.eql(newUser.name);
            expect(res.body).to.not.have.property('password');
            expect(res.headers.location).to.eql(`/api/user/${res.body.id}`);
          });
      });

      it('stores the new user in db with bcryped password', () => {
        const newUser = {
          username: 'test username',
          password: '11AAaa!!',
          name: 'test name',
        };
        return supertest(app)
          .post('/api/user')
          .send(newUser)
          .expect(res =>
            db
              .from('user')
              .select('*')
              .where({ id: res.body.id })
              .first()
              .then(row => {
                expect(row.username).to.eql(newUser.username);
                expect(row.name).to.eql(newUser.name);

                return bcrypt.compare(newUser.password, row.password);
              })
              .then(compareMatch => {
                expect(compareMatch).to.be.true;
              })
          );
      });
    });
  });


  describe('PATCH /api/user', () => {
    beforeEach('insert users', () => helpers.seedUsers(db, testUsers));
    context('with incorrect bearer token and valid data', () => {
      it('responds 401 unauthorized', () => {
        return supertest(app)
          .patch('/api/user')
          .set('Authorization', helpers.makeAuthHeader(testUser, 'not a very good secret'))
          .expect(401)
      })
    })
    context('with correct bearer token and valid data', () => {
      it('responds 200 OK', () => {
        let newBudgets = ({'user':{
          calorieBudget:2000,
          fatBudget:50,
          proteinBudget:50,
          carbBudget:50
        }})
        return supertest(app)
          .patch('/api/user')
          .set('Authorization', helpers.makeAuthHeader(testUser, process.env.JWT_SECRET))
          .send(newBudgets)
          .expect(200)
          .expect(res => {
            let budgets = res.body
            expect(budgets.calorieBudget).to.eql(newBudgets.user.calorieBudget);
            expect(budgets.fatBudget).to.eql(newBudgets.user.fatBudget);
            expect(budgets.carbBudget).to.eql(newBudgets.user.carbBudget);
            expect(budgets.proteinBudget).to.eql(newBudgets.user.proteinBudget);
          });
      })
    })
  })
  describe('PATCH /api/user/dark', () => {
    beforeEach('insert users', () => helpers.seedUsers(db, testUsers));
    context('with correct bearer token', () => {
      it('responds 200 OK', () => {

        return supertest(app)
          .patch('/api/user/dark')
          .set('Authorization', helpers.makeAuthHeader(testUser, process.env.JWT_SECRET))
          .expect(200) 
      })
    })
  })
  describe('GET /api/user', () => {
    beforeEach('insert users', () => helpers.seedUsers(db, testUsers));
    context('with correct bearer token', () => {
      it('responds with user budgets', () => {
        return supertest(app)
          .get('/api/user')
          .set('Authorization', helpers.makeAuthHeader(testUser, process.env.JWT_SECRET))
          .expect(200)
          .expect(res => {
            let user = res.body.user[0]
            expect(user.calorieBudget).to.eql(testUser.calorieBudget);
            expect(user.fatBudget).to.eql(testUser.fatBudget);
            expect(user.carbBudget).to.eql(testUser.carbBudget);
            expect(user.proteinBudget).to.eql(testUser.proteinBudget);
          });
      })
    })
  })
});


