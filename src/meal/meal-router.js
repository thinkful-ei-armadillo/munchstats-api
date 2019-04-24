const express = require('express');
const { requireAuth } = require('../middleware/jwt-auth');
const MealService = require('./meal-service');

const mealRouter = express.Router()
const jsonBodyParser = express.json()

mealRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    try{
      const meal = await MealService.getUsersMeal(
        req.app.get('db'),
        req.user.id
      )

      if(!meal){
        return res.status(404).json({
          error: `You don't have any meals.`
        })
      }

      req.meal = meal;
      next()
    } catch(error){
      next(error)
    }
  })

mealRouter
  .get('/', async (req, res, next) => {
    try {
      const meal = await MealService.getUsersMeal(
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

mealRouter
  .post('/', jsonBodyParser, async (req, res, next) => {
    const { name, user_id } = req.body;
    console.log(user_id);
    console.log(name);
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

mealRouter
  .delete('/', jsonBodyParser, async (req, res, next) => {
    const { meal } = req.body;
    const delMeal = meal;

    MealService.deleteMeal(
      req.app.get('db'),
      delMeal
    )
      .then(meal => {
        res.status(200).json(meal)
      })
      .catch(next);
  });

mealRouter
  .patch('/', jsonBodyParser, (req, res, next) => {
    const { meal } = req.body;
    const newMeal = meal;

    MealService.updateMeal(
      req.app.get('db'),
      newMeal
    )
      .then(meal => {
        res.status(200).json(meal);
      })
      .catch(next);
    });

module.exports = mealRouter;

