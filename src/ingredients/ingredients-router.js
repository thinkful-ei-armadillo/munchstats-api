const express = require('express');
const { requireAuth } = require('../middleware/jwt-auth');
const IngredientService = require('./ingredients-service');
const ingredientRouter = express.Router();
const jsonBodyParser = express.json();

ingredientRouter
  .use(requireAuth);

ingredientRouter
  .route('/')
  // this block makes a post request to the database that returns all of a meal's ingredients
  .post(jsonBodyParser, async (req, res, next) => {
    try {
      const ingredients = await IngredientService.getMealIngredients(
        req.app.get('db'),
        req.body.meal.id
      );

      res.json({ingredients});
      next();
    } catch(error){
      next(error);
    }
  })
  // this block makes a delete request to the database and returns the ingredient that was deleted
  .delete(jsonBodyParser, (req, res, next) => {
    IngredientService.deleteIngredient(
        req.app.get('db'),
        req.body.ingredient_id
    )
    .then((resjson) => {
      res.status(200).json(req.body.ingredient_id);
    })
    .catch(next);
  });

ingredientRouter
  // makes a post request that inserts a new ingredient into a specific meal
  .post('/:meal_id', jsonBodyParser, async (req, res, next) => {
    // all ingredient info will be in req.body
    const { ingredient } = req.body;
    const newIngredient = ingredient;
    const {meal_id} = req.params;

    IngredientService.insertIngredient(
      req.app.get('db'),
      newIngredient,
      meal_id
    )
      .then(ingredient => {
        res.status(201).send(ingredient);
      })
      .catch(next);
  });

module.exports = ingredientRouter;