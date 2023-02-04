const express = require('express');
const bodyParser = require('body-parser');
coocieParser = require('cookie-parser');
const DashboardRouter = express.Router();
const DashboardController = require('../Controllers/DashboardController');
const EventController = require('../Controllers/EventController');
const AuthMiddleware = require('../Middlewares/AuthMiddleware');

DashboardRouter.use(bodyParser.urlencoded({ extended: true }));
DashboardRouter.use(coocieParser());
DashboardRouter.use(AuthMiddleware);

DashboardRouter.get('/', DashboardController.index);
DashboardRouter.post('/event/create', EventController.createEvent);
DashboardRouter.post('/event/delete', EventController.deleteEvent);

module.exports = DashboardRouter;