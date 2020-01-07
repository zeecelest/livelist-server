const express = require('express');
const SpotsService = require('./auth-service');
const { requireAuth } = require('../../middleware/jwt-auth');

const spotsRouter = express.Router();
const jsonBodyParser = express.json();
