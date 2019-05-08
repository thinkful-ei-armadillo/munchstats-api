## Munch Stats API
+ [Client Repo](https://github.com/thinkful-ei-armadillo/munchstats-client)  

### Endpoints
#### /auth/token
+ POST only endpoint.
+ Validates user credentials.
+ If validation is passed, it will respond with a JWT token.

#### /events
+ POST and DELETE new events to user's daily meal log.

#### /events/date
+ GET events inside a range of dates.

#### /events/:eventId
+ GET events based on an event id.

#### /ingredients
+ POST a meal id and get a list of ingredients for that meal in return.
+ DELETE an ingredient from a meal based on a meal id.

#### /meal
+ GET, POST, PATCH and DELETE user's meals into the database.

#### /meal/:mealId
+ GET only one meal based on a meal id.

#### /ingredients/:meal_id
+ POST an ingredient to a meal based on a meal id.

#### /proxy
+ Sends user requests to [Edamam's API](https://developer.edamam.com/) by proxy to recieve nutrition information on different ingredients.

#### /user
+ POST only endpoint.
+ Create new user profile.

### Tech Stack
+ Node.js
+ Express
+ Deployed with Heroku

### Development Team
+ [Michael Bramble](https://github.com/michaelbramble)  
+ [Geordie Connell](https://github.com/geordo9)  
+ [David Haugen](https://github.com/DavidHaugen)  
+ [Bob Nearents](https://github.com/bobnearents)  