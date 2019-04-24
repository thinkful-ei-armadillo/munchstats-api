'use strict';

const IngredientService = {
  getMealIngredients(db, meal_id){
    return db
      .from('ingredients')
      .select('*')
      .where({meal_id});
  },

  insertIngredient(db, newIngredient, meal_id) {
    return db
      .insert(newIngredient)
      .into('ingredients')
      .where({meal_id})
      .returning('*');
  },

  deleteIngredient(knex, id) {
    return knex
      .from('ingredients')
      .where({id})
      .delete();
  },
};

module.exports = IngredientService;