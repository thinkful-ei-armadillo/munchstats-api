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
  },

  deleteMeal(db, id){
    return db
      .from('meal')
      .where(id)
      .delete()
  },

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
      })
  }
};

module.exports = MealService;