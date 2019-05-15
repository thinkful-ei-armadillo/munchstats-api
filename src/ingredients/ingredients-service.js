
const IngredientService = {
  // gets all of a meal's ingredients from the database via its id
  getMealIngredients(db, meal_id){
    return db
      .from('ingredients')
      .select('*')
      .where({meal_id});
  },

  // inserts a new ingredient into the ingredients table, grouped by meal id
  insertIngredient(db, newIngredient, meal_id) {
    return db
      .insert(newIngredient)
      .into('ingredients')
      .where({meal_id})
      .returning('*');
  },

  // deletes an ingredient from the database
  deleteIngredient(knex, id) {
    return knex
      .from('ingredients')
      .where({id})
      .delete();
  },
};

module.exports = IngredientService;