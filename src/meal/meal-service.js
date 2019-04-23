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
      .returning('*')
  }
};

module.exports = MealService;