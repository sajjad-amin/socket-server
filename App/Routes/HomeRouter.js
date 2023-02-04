const express = require('express');
const HomeRouter = express.Router();
const WebsiteController = require('../Controllers/WebsiteController');

HomeRouter.get('/', WebsiteController.index);

module.exports = HomeRouter;