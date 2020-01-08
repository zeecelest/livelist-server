const express = require('express');
const ListsService = require('./lists-service');
const { requireAuth } = require('../middleware/jwt-auth');

const listsRouter = express.Router();
const jsonBodyParser = express.json();

listsRouter
  .use(requireAuth)
  .route('/')
  .get((req, res, next) => {
    try {
      ListsService.getAllLists(req.app.get('db')).then(lists => {
        res.status(200).json(lists);
      });
    } catch (error) {
      next(error);
    }
  })
  .post(jsonBodyParser, (req, res, next) => {
    const { city, state, name, is_public } = req.body;
    for (const field of ['name', 'city', 'state', 'is_public'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        });
    try {
      const newList = {
        city, // <== need to keep some type of standard
        state,
        name,
        is_public
      };
      ListsService.insertList(res.app.get('db'), newList);
    } catch (error) {
      next(error);
    }
  });

listsRouter
  .use(requireAuth)
  .route('/:city')
  .get((req, res, next) => {
    try {
      ListsService.getAllListsFromCity(
        req.app.get('db'),
        req.params.city
      ).then(lists => res.status(200).json(lists));
    } catch (error) {
      next(error);
    }
  });
module.exports = listsRouter;
