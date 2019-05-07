const express = require('express');
const { requireAuth } = require('../middleware/jwt-auth');
const MealService = require('./meal-service');
const mealRouter = express.Router();
const jsonBodyParser = express.json();

mealRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    /*
    // This try block checks to see if a user has meals in the
    // database. If there are none, it sends a 404.
    */
    try{
      const meal = await MealService.getAllUserMeals(
        req.app.get('db'),
        req.user.id
      );

      if(!meal){
        return res.status(404).json({
          error: `You don't have any meals.`
        })
      }
      req.meal = meal;
      next();
    } catch(error){
      next(error);
    }
  })

// display all of a user's meals
mealRouter
  .get('/', async (req, res, next) => {
    try {
      const meal = await MealService.getAllUserMeals(
        req.app.get('db'),
        req.user.id
      );
      res.json({
        meal
      })
      next()
    } catch(error){
      next(error)
    }
  });

// post a new meal to the database
mealRouter
  .post('/', jsonBodyParser, async (req, res, next) => {
    const { name, user_id } = req.body;
    const fields = ['name'];

    for (const field of fields) {
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        });
    }

    MealService.insertMeal(
      req.app.get('db'),
      {name,
      user_id}
    )
      .then(meal => {
        res.status(201).json(meal)
      })
      .catch(next)
  });

// delete a meal (by id) from the database
mealRouter
  .delete('/', jsonBodyParser, async (req, res, next) => {
    const { meal } = req.body;
    const delMeal = meal;

    MealService.deleteMeal(
      req.app.get('db'),
      delMeal
    )
      .then(meal => {
        res.status(200).json(delMeal)
      })
      .catch(next);
  });

// update meal info in database
mealRouter
  .patch('/', jsonBodyParser, (req, res, next) => {

    MealService.updateMeal(
      req.app.get('db'),
      req.body
    )
      .then(meal => {
        res.status(200).json(req.body);
      })
      .catch(next);
    });

// get only one meal by id
mealRouter
  .get('/:mealId', jsonBodyParser, (req, res, next) => {
    MealService.getSingleUserMeal(
      req.app.get('db'),
      req.user.id,
      Number(req.params.mealId)
    )
      .then(meal => {
        if(meal.length === 0) {
          return res.status(404).json({
            error: { message : 'Meal not found'}
          });
        }
        res.status(200).json(meal);
      })
      .catch(next);
  });

module.exports = mealRouter;