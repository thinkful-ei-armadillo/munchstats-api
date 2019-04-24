'use strict';

const xss = require('xss');

const ApiProxyService = {
  serializeFood(food){
    return {
      // id: goal.id,
      // name: xss(goal.name),
      // complete: goal.complete,
      // date_created: goal.date_created,
      // user_id: goal.user_id
    };
  }
};


module.exports = ApiProxyService;