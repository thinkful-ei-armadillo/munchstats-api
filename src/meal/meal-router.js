const express = require('express');
const { requireAuth } = require('../middleware/jwt-auth');
const MealService = require('./meal-service');

const mealRouter = express.Router()
const jsonBodyParser = express.json()

// TODO: patch, delete

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
  .post('/', jsonBodyParser, async (req, res, next) => {
    const { meal } = req.body;
    const newMeal = { meal };

    MealService.insertMeal(
      req.app.get('db'),
      newMeal
    )
      .then(meal => {
        res.status(201)
      })
      .catch(next)
  });

module.exports = mealRouter;