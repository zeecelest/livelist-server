const express = require('express');
const path = require('path');
const UserService = require('./user-service');

const userRouter = express.Router();
const jsonBodyParser = express.json();

userRouter
  .post('/', jsonBodyParser, async (req, res, next) => {
    const { password, username, name, state, city } = req.body;

    for (const field of ['name', 'username', 'password', 'city', 'state'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        });

    try {
      const passwordError = UserService.validatePassword(password);

      if (passwordError) return res.status(400).json({ error: passwordError });

      const hasUserWithUserName = await UserService.hasUserWithUserName(
        req.app.get('db'),
        username
      );

      if (hasUserWithUserName)
        return res.status(400).json({ error: `Username already taken` });

      const hashedPassword = await UserService.hashPassword(password);

      const newUser = {
        username,
        password: hashedPassword,
        name,
        city,
        state
      };

      const user = await UserService.insertUser(req.app.get('db'), newUser);

      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${user.id}`))
        .json(UserService.serializeUser(user));
    } catch (error) {
      next(error);
    }
  })
  .get((req, res, next) => {
    try {
      res.status(200);
    } catch (error) {
      next(error);
    }
  });

userRouter.route('/lists/:id').get((req, res, next) => {
  try {
    UserService.returnAllListsByUserId(req.app.get('db'), req.params.id).then(
      lists => {
        res.status(200).json(lists);
      }
    );
  } catch (error) {
    next(error);
  }
});

userRouter.route('/lists/:id').get((req, res, next) => {
  try {
    UserService.returnAllListsByUserId(req.app.get('db'), req.params.id).then(
      lists => {
        res.status(200).json(lists);
      }
    );
  } catch (error) {
    next(error);
  }
});

module.exports = userRouter;
