const express = require('express');
const path = require('path');
const UserService = require('./user-service');
const { requireAuth } = require('../middleware/jwt-auth');
const userRouter = express.Router();
const jsonBodyParser = express.json();

userRouter
  .post('/', jsonBodyParser, async (req, res, next) => {
    const { password, username, name } = req.body;

    for(const field of ['name', 'username', 'password'])
      if(!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        });

    try {
      const passwordError = UserService.validatePassword(password);

      if(passwordError)
        return res.status(400).json({ error: passwordError });

      const hasUserWithUserName = await UserService.hasUserWithUserName(
        req.app.get('db'),
        username
      );

      if(hasUserWithUserName)
        return res.status(400).json({ error: `Username already taken` });

      const hashedPassword = await  UserService.hashPassword(password);

      const newUser = {
        username,
        password: hashedPassword,
        name,
      };

      const user = await UserService.insertUser(
        req.app.get('db'),
        newUser
      );

      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${user.id}`))
        .json(UserService.serializeUser(user))
    } catch(error) {
      next(error);
    }
  })

userRouter
  .use(requireAuth)
  .get('/', async (req, res, next) => {
    const user = await UserService.getUserBudgets(
      req.app.get('db'),
      req.user.id
    );
    res.json({
      user
    })
  })

userRouter
  .use(requireAuth)
  .patch('/', jsonBodyParser, (req, res, next) => {
    const { user } = req.body;
    const newUser = user;
    UserService.updateUserBudgets(
      req.app.get('db'),
      req.user.id,
      newUser
    )
      .then(() => {
        res.status(200).json(newUser);
      })
      .catch(next);
  });

userRouter
  .use(requireAuth)
  .patch('/dark', jsonBodyParser, (req, res, next) => {
    const { isDark } = req.user;
    const newDark = !isDark;
    UserService.toggleUserDarkMode(
      req.app.get('db'),
      req.user.id,
      newDark
    )
      .then(() => {
        res.status(200).json(newDark);
      })
      .catch(next);
  });

module.exports = userRouter;