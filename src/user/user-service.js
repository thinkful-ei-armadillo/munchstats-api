'use strict';

const bcrypt = require('bcryptjs');

const UserService = {
  hasUserWithUserName(db, username) {
    return db('user')
      .where({ username })
      .first()
      .then(user => !!user);
  },

  getUserBudgets(db, id) {
    return db('user')
      .select('calorieBudget', 'fatBudget', 'carbBudget', 'proteinBudget', 'isDark')
      .where({id: id});
  },

  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('user')
      .returning('*')
      .then(([user]) => user);
  },

  updateUserBudgets(db, id, payload) {
    return db
      .from('user')
      .where({id: id})
      .update({
        calorieBudget: payload.calorieBudget,
        fatBudget: payload.fatBudget,
        carbBudget: payload.carbBudget,
        proteinBudget: payload.proteinBudget,
      });
  },

  toggleUserDarkMode(db, id, payload) {
    return db 
      .from('user')
      .where({id: id})
      .update({
        isDark: payload
      });
  },

  validatePassword(password) {
    // various new password requirements, may add more in the future
    if (password.length < 8) {
      return 'Password be longer than 8 characters';
    }
    if (password.length > 72) {
      return 'Password be less than 72 characters';
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with empty spaces';
    }
    return null;
  },

  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },

  serializeUser(user) {
    return {
      id: user.id,
      name: user.name,
      username: user.username
    };
  },
};

module.exports = UserService;

