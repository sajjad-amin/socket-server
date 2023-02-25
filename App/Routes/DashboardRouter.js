const express = require('express');
const bodyParser = require('body-parser');
coocieParser = require('cookie-parser');
const DashboardRouter = express.Router();
const DashboardController = require('../Controllers/DashboardController');
const EventController = require('../Controllers/EventController');
const ProfileController = require("../Controllers/ProfileController");
const AuthMiddleware = require('../Middlewares/AuthMiddleware');
const VerifiedUserMiddleware = require('../Middlewares/VerifiedUserMiddleware');

DashboardRouter.use(bodyParser.urlencoded({ extended: true }));
DashboardRouter.use(coocieParser());
DashboardRouter.use(AuthMiddleware);
if (process.env.PRODUCTION === 'true') {
    DashboardRouter.use(VerifiedUserMiddleware);
}
DashboardRouter.get('/', DashboardController.index);
DashboardRouter.get('/profile', ProfileController.index);
DashboardRouter.post('/profile/delete', ProfileController.deleteAccount);
DashboardRouter.post('/event/create', EventController.createEvent);
DashboardRouter.post('/event/delete', EventController.deleteEvent);
DashboardRouter.post('/event/is-exist', EventController.isEventExist);

module.exports = DashboardRouter;