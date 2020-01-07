const express = require('express');
const ListsService = require('./auth-service');
const { requireAuth } = require('../../middleware/jwt-auth');

const listsRouter = express.Router();
const jsonBodyParser = express.json();
