const express = require('express');
const ListsService = require('./lists-service');
const { requireAuth } = require('../middleware/jwt-auth');

const listsRouter = express.Router();
//const jsonBodyParser = express.json();

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
  });
module.exports = listsRouter;
