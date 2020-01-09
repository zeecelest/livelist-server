const express = require('express');
const SpotsService = require('./spots-service');
const { requireAuth } = require('../middleware/jwt-auth');

const spotsRouter = express.Router();
const jsonBodyParser = express.json();

spotsRouter
  .use(requireAuth)
  .route('/')
  .get((req, res, next) => {
    try {
      SpotsService.getAllSpots(req.app.get('db')).then(spots => {
        res.status(200).json(spots);
      });
    } catch (error) {
      next(error);
    }
  })
  .post(jsonBodyParser, (req, res, next) => {
    const { name, address, city, state, lat, lon, tags } = req.body;
    for (const field of ['name', 'city', 'state', 'lat', 'lon', 'address'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        });
    try {
      let newSpot = {
        address,
        city,
        lat,
        tags,
        lon,
        name,
        state
      };
      SpotsService.insertSpot(req.app.get('db'), newSpot).then(spot => {
        res.status(200).json(spot);
      });
    } catch (error) {
      next(error);
    }
  });
spotsRouter
  .use(requireAuth)
  .route('/:spot_id')
  .get((req, res, next) => {
    try {
      SpotsService.getSpotById(req.app.get('db'), req.params.spot_id).then(
        spot => {
          res.status(200).json(spot);
        }
      );
    } catch (error) {
      next(error);
    }
  })
  .patch(jsonBodyParser, (req, res, next) => {
    const { name, address, city, state, lat, lon, id, tags } = req.body;
    for (const field of ['name', 'city', 'state', 'lat', 'lon', 'address'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        });
    try {
      let edittedSpot = {
        name,
        address,
        city,
        state,
        tags,
        lat,
        lon
      };
      SpotsService.updateSpot(req.app.get('db'), id, edittedSpot).then(spot => {
        res.status(200).json(spot);
      });
    } catch (error) {
      next(error);
    }
  })
  .delete((req, res, next) => {
    try {
      SpotsService.deleteSpot(req.app.get('db'), req.params.spot_id).then(
        () => {
          res.status(204);
        }
      );
    } catch (error) {
      next(error);
    }
  });

module.exports = spotsRouter;
