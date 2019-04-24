'use strict';

const MealService = {
  getUsersMeal(db, user_id){
    return db
      .from('meal')
      .select('*')
      .where({user_id});
  },

  insertMeal(db, newMeal){
    return db
      .insert(newMeal)
      .into('meal')
      .returning('*');
  },

  deleteMeal(db, id){
    return db
      .from('meal')
      .where({id})
      .delete();
  },

  updateMeal(db, id, payload){
    return db
      .from('meal')
      .where({id})
      .update(payload);
  }
};

module.exports = MealService;