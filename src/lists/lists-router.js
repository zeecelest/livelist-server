const express = require('express');
const ListsService = require('./lists-service');
const { requireAuth } = require('../middleware/jwt-auth');
const package = require('../fixtures');
const AuthService = require('../auth/auth-service');

const listsRouter = express.Router();
const jsonBodyParser = express.json();

listsRouter
  .use(requireAuth)
  .route('/')
/*Returns all lists, includes the ammount of likes and if its liked by current user */
  .get((req, res, next) => {
    try {
      ListsService.getAllLists(req.app.get('db'), req.user.id).then((lists) => {
        if (lists.rows === 0) {
          res.status(200).json({ message: 'There are no lists... thats odd.' });
        } else {
          res.status(200).json(lists.rows);
        }
      });
    } catch (error) {
      next(error);
    }
  })
/*Adds new record to lists table and a refrence to users_lists table */
  .post(jsonBodyParser, (req, res, next) => {
    const { city, state, name, is_public, tags, description } = req.body;
    for (const field of ['name', 'city', 'state', 'is_public'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        });
    try {
      const newList = {
        name,
        tags,
        city,
        state,
        description,
        is_public
      };
      const user_id = req.user.id;
      return ListsService.insertList(res.app.get('db'), newList, user_id).then(
        (list) => {
          res.status(200).json(list);
        }
      );
    } catch (error) {
      next(error);
    }
  });
listsRouter
  .use(requireAuth)
  .route('/user')
/*Returns all lists from logged in user*/
  .get((req, res, next) => {
    return ListsService.getAllListsFromUser(
      req.app.get('db'),
      req.user.id
    ).then((resp) => {
      if (resp.length === 0) {
        return res.json({ message: 'there are no lists to send' });
      } else {
        return res.status(200).json(resp);
      }
    });
  });

listsRouter
  .use(requireAuth)
/*Returns the list record from list table and joins it to all the spot 
  * records that are refrenced on the lists_spots table*/
  .route('/:list_id')
  .get((req, res, next) => {
    let list = {};
    try {
      return ListsService.getListById(
        req.app.get('db'),
        req.params.list_id
      ).then((resp) => {
        if (resp.rows.length !== 0) {
          list = {
            list_name: resp.rows[0].list_name,
            list_id: resp.rows[0].list_id,
            tags: resp.rows[0].list_tags,
            created_by: resp.rows[0].created_by,
            description: resp.rows[0].description,
            spots: []
          };
          resp.rows.forEach((x) => {
            let item = {
              id: x.spot_id,
              name: x.name,
              tags: x.spots_tags,
              address: x.address,
              city: x.city,
              state: x.state,
              lat: x.lat,
              lng: x.lng
            };
            list.spots.push(item);
          });
        } else {
          list = {
            list_name: 'none',
            list_id: 0,
            tags: 'none',
            created_by: 'none',
            description: 'none',
            spots: []
          };
        }
        res.status(200).json(list);
      });
    } catch (error) {
      next(error);
    }
  })
/*Delete list record from lists and deletes the record found in users_lists*/
  .delete((req, res, next) => {
    try {
      let db = req.app.get('db');
      ListsService.deleteListReference(
        db,
        req.params.list_id,
        req.user.id
      ).then((data) => {
        if (data == 0) {
          res.json({ message: 'nothing to delete' });
        } else {
          res.json(data);
        }
      });
    } catch (error) {
      next(error);
    }
  })
  .patch(jsonBodyParser, (req, res, next) => {
    const { city, state, name, is_public, tags, description } = req.body;
    for (const field of ['city', 'state', 'name', 'is_public', 'tags'])
      if (req.body[field] === undefined)
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        });
    try {
      let editList = {
        city,
        state,
        name,
        is_public,
        description,
        tags
      };
      ListsService.updateList(
        req.app.get('db'),
        req.user.id,
        parseInt(req.params.list_id),
        editList
      ).then((list) => {
        res.status(200).json(list);
      });
    } catch (error) {
      next(error);
    }
  });

/*Toggle favorite on list, adds/removes record in liked_by table - dlb*/
listsRouter
  .use(requireAuth)
  .route('/like/:id')
  .post((req, res, next) => {
    try {
      ListsService.likeList(req.app.get('db'), req.params.id, req.user.id).then(
        (resp) => {
          res.status(200).json({ like: resp[2].rows[0].count });
        }
      );
    } catch (error) {
      next(error);
    }
  });

/*Returns the lists that belong to a specific city*/
listsRouter
  .use(requireAuth)
  .route('/city/:city')
  .get((req, res, next) => {
    let city = req.params.city.split('_').join(' ');
    try {
      ListsService.getAllListsFromCity(
        req.app.get('db'),
        city,
        req.user.id
      ).then((lists) => {
        if (lists.rows.length === 0) {
          return res
            .status(200)
            .json({ message: `There are no lists from the city "${city}"` });
        } else {
          return res.status(200).json(lists.rows);
        }
      });
    } catch (error) {
      next(error);
    }
  });
module.exports = listsRouter;
