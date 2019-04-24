'use strict';

const express = require('express');
const { requireAuth } = require('../middleware/jwt-auth');
const ApiProxyService = require('./api-proxy-service');
const apiProxyRouter = express.Router();
const jsonBodyParser = express.json();
const fetch = require('node-fetch');
require('dotenv').config();


apiProxyRouter
  .all(requireAuth)
  .route('/foods')
  .post(jsonBodyParser, (req, res, next) => {
    const { food } = req.body;
    if (!req.body['food'])
      return res.status(400).json({
        error: 'Missing food in request body'
      });
    if(food.length > 30){
      return res.status(400).json({
        error: 'Food names cannot exceed 30 characters'
      });
    }
    return fetch(`${process.env.FOOD_API_URI_START}${food}${process.env.FOOD_API_URI_END}`)
      .then(res => res.json())
      .then(res => {
        let results = [];
        for(let i = 0; i < 10; i++){
          let item = res.hints[i];
          let newIngredient = {
            id: item.food.foodId,
            name: item.food.label,
            calories: (item.food.nutrients.ENERC_KCAL) ? item.food.nutrients.ENERC_KCAL : 0,
            protein: (item.food.nutrients.PROCNT) ? item.food.nutrients.PROCNT : 0,
            fat: (item.food.nutrients.FAT) ? item.food.nutrients.FAT : 0,
            carbs: (item.food.nutrients.CHOCDF) ? item.food.nutrients.CHOCDF : 0,
            image: item.food.image,
            measures: item.measures
          };
          results.push(newIngredient);
        }
        return results;
      })
      .then(results => {
        res.status(201);
        res.json(results);
      })
      .catch(next);
  });

apiProxyRouter
  .all(requireAuth)
  .route('/nutrition')
  .post(jsonBodyParser, (req, res, next) => {
    const { ingredients, name, label, quantity } = req.body;
    if (!req.body['ingredients'])
      return res.status(400).json({
        error: 'Missing ingredients in request body'
      });
    if (!req.body['name'])
      return res.status(400).json({
        error: 'Missing name in request body'
      });
    if (!req.body['label'])
      return res.status(400).json({
        error: 'Missing label in request body'
      });
    if (!req.body['quantity'])
      return res.status(400).json({
        error: 'Missing quantity in request body'
      });
    const formattedBody = {ingredients: ingredients};
    return fetch(`${process.env.NUTRITION_API_URI}`, {
      method: 'POST',
      body: JSON.stringify(formattedBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(results => {
        console.log(results.totalNutrients);
        const resultIngredient = {
          name: name,
          // meal_id: mealId,
          total_calorie: results.calories,
          total_fat:(results.totalNutrients) ? results.totalNutrients.FAT.quantity : 0,
          total_carbs: (results.totalNutrients) ? results.totalNutrients.CHOCDF.quantity: 0,
          total_protein: (results.totalNutrients) ? results.totalNutrients.PROCNT.quantity: 0,
          amount: quantity.value,
          unit: label
        };

        res.status(201);
        res.json(resultIngredient);
      })
      .catch(next);
  });


module.exports = apiProxyRouter;