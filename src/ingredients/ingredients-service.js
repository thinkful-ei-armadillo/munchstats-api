
  getMealIngredients(db, meal_id){
    return db
      .from('ingredient')
      .select('*')
      .where({meal_id});
  },