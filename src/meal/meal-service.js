
const MealService = {
  // gets all of a user's meals from the database via the user id
  getAllUserMeals(db, user_id){
    return db
      .from('meal')
      .select('*')
      .where({user_id});
  },

  // get a single meal from the database via the user's and meal's ids
  getSingleUserMeal(db, user_id, id){
    return db
      .from('meal')
      .select('*')
      .where({user_id, id});
  },

  // inserts a new meal into the database
  insertMeal(db, newMeal){
    return db
      .insert(newMeal)
      .into('meal')
      .returning('*');
  },

  // deletes a meal from the database via its id
  deleteMeal(db, id){
    return db
      .from('meal')
      .where(id)
      .delete();
  },

  // updates a meal in the database via its id and uses a payload to update specific keys of the meal
  updateMeal(db, payload){
    return db
      .from('meal')
      .where({id: payload.id})
      .update({
        id: payload.id,
        name: payload.name,
        user_id: payload.user_id,
        total_calorie: payload.total_calorie,
        total_fat: payload.total_fat,
        total_carbs: payload.total_carbs,
        total_protein: payload.total_protein,
        rating: payload.rating
      });
  }
};

module.exports = MealService;