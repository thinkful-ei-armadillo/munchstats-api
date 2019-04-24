const express = require('express');
const { requireAuth } = require('../middleware/jwt-auth');
const IngredientService = require('./ingredients-service');

const ingredientRouter = express.Router()
const jsonBodyParser = express.json()

// TODO: patch, delete

ingredientRouter
  .use(requireAuth)
//   .use(async (req, res, next) => {
//     try{
//       const meal = await MealService.getUsersMeal(
//         req.app.get('db'),
//         req.user.id
//       )

//       if(!meal){
//         return res.status(404).json({
//           error: `You don't have any meals.`
//         })
//       }

//       req.meal = meal;
//       next()
//     } catch(error){
//       next(error)
//     }
//   })

ingredientRouter
  .route('/')
  .get(async (req, res, next) => {
    try {
      const ingredients = await IngredientService.getMealIngredients(
        req.app.get('db'),
        req.meal.id,
      )

      if(!ingredients){
        return res.status(404).json({
          error: `You don't have any ingredients.`
        })
      }

      res.json({ ingredients })
      next()
    } catch (error) {
      next(error)
    }
  })
  .delete((req, res, next) => {
    IngredientService.deleteIngredient(
        req.app.get('db'),
        req.params.ingredient_id
    )
    .then((resjson) => {
        res.status(200).json(resjson);
    })
    .catch(next);
  });

ingredientRouter
  .post('/', jsonBodyParser, async (req, res, next) => {
      // all ingredient info will be in req.body
    const { ingredient } = req.body;
    const newIngredient = { ingredient };

    IngredientService.insertIngredient(
      req.app.get('db'),
      newIngredient
    )
      .then(ingredient => {
        res.status(201)
      })
      .catch(next)
  });

module.exports = ingredientRouter;