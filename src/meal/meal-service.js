const MealService = {
  getUsersMeal(db, user_id){
    return db
      .from('meal')
      .select('*')
      .where({user_id});
  },

  getMealIngredients(db, meal_id){
    return db
      .from('ingredient')
      .select('*')
      .where({meal_id});
  },

  insertMeal(db, newMeal){
    return db
      .insert(newMeal)
      .into('meal')
      .returning('*')
  }
};

module.exports = MealService;