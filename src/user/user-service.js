
const bcrypt = require('bcryptjs');

const UserService = {
  // checks to see if username exists in the database
  hasUserWithUserName(db, username) {
    return db('user')
      .where({ username })
      .first()
      .then(user => !!user);
  },

  // gets the user's nutrition budget from the database
  getUserBudgets(db, id) {
    return db('user')
      .select('calorieBudget', 'fatBudget', 'carbBudget', 'proteinBudget', 'isDark')
      .where({id: id});
  },

  // inserts a new user into the database
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('user')
      .returning('*')
      .then(([user]) => user);
  },

  // updates the user's nutrition budget in the data via the user's id and a payload to update specific points
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

  // toggles Dark Mode on and off
  toggleUserDarkMode(db, id, payload) {
    return db 
      .from('user')
      .where({id: id})
      .update({
        isDark: payload
      });
  },

  validatePassword(password) {
    // various new password requirements
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

