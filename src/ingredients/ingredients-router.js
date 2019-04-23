mealRouter
  .get('/', async (req, res, next) => {
    try {
      const ingredients = await MealService.getMealIngredients(
        req.app.get('db'),
        req.meal.id,
      )

      res.json({
        meal: req.meal,
        ingredients,
      })
      next()
    } catch (error) {
      next(error)
    }
  })