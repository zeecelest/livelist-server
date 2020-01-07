const express = require('express');
const ListsService = require('./auth-service');
const { requireAuth } = require('../../middleware/jwt-auth');

const listsRouter = express.Router();
const jsonBodyParser = express.json();

listsRouter.route('/').get((req, res, next) => {
  const lists = ListsService.getAllLists(req.app.get(db));
  res.json({ lists });
  return res.status(200);
});
