'use strict';

const IngredientService = {
  getMealIngredients(db, meal_id){
    return db
      .from('ingredient')
      .select('*')
      .where({meal_id});
  },

  insertIngredient(db, newIngredient){
    return db
      .insert(newIngredient)
      .into('ingredient')
      .returning('*');
  },

  deleteIngredient(knex, id) {
    return knex
      .from('ingredient')
      .where({id})
      .delete();
  },
};

module.exports = IngredientService;