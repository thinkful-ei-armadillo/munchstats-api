## Munch Stats API
+ [Client Repo](https://github.com/thinkful-ei-armadillo/munchstats-client)  

### Endpoints
#### /api/auth/token
+ POST only endpoint.
+ Validates user credentials.
+ If validation is passed, it will respond with a JWT token.

#### /api/meal
+ GET, POST, PATCH and DELETE user's meals into the database.

#### /api/ingredients
+ POST a meal id and get a list of ingredients for that meal in return.
+ DELETE an ingredient from a meal based on a meal id.

#### /api/ingredients/:meal_id
+ POST an ingredient to a meal based on a meal id.

#### /api/user
+ POST only endpoint.
+ Create new user profile.

#### /api/proxy
+ Sends user requests to [Edamam's API](https://developer.edamam.com/) by proxy to recieve nutrition information on different ingredients.

### Tech Stack
+ Node.js
+ Express
+ Deployed with Heroku