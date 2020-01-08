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
        res.status(200).send(lists);
      });
    } catch (error) {
      next(error);
    }
  })
  .post(jsonBodyParser, (req, res, next) => {
    const { city, state, name, is_public } = req.body;
    for (const field of ['name', 'city', 'state', 'is_public'])
      if (!req.body[field] || !req.user.id)
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        });
    try {
      const newList = {
        city,
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
  .route('/:list_id')
  .get((req, res, next) => {
    try {
      ListsService.getListByIdTwo(req.app.get('db'), req.params.list_id).then(
        list => {
          res.status(200).json(list);
        }
      );
    } catch (error) {
      next(error);
    }
  })
  .delete((req, res, next) => {
    try {
      let db = req.app.get('db');
      ListsService.deleteListReference(
        db,
        req.user.id,
        req.params.list_id
      ).then(
        res
          .status(202)
          .json({ message: `Record ${req.params.list_id} was deleted` })
      );
    } catch (error) {
      next(error);
    }
  })
  .patch((req, res, next) => {
    try {
      ListsService.updateList(req.app.get('db'), req.body.editList).then(
        list => {
          res.status(200).json(list);
        }
      );
    } catch (error) {
      next(error);
    }
  });

// listsRouter
//   .use(requireAuth)
//   .route('/:city')
//   .get((req, res, next) => {
//     try {
//       ListsService.getAllListsFromCity(
//         req.app.get('db'),
//         req.params.city
//       ).then(lists => res.status(200).json(lists));
//     } catch (error) {
//       next(error);
//     }
//   });
module.exports = listsRouter;
