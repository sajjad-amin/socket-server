const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const AuthRouter = express.Router();
const AuthController = require('../Controllers/AuthController');

AuthRouter.use(bodyParser.urlencoded({ extended: true }));
AuthRouter.use(cookieParser());
AuthRouter.get('/login', AuthController.login);
AuthRouter.post('/login', AuthController.loginPost);
AuthRouter.get('/register', AuthController.register);
AuthRouter.post('/register', AuthController.registerPost);
AuthRouter.get('/logout', AuthController.logout);

module.exports = AuthRouter;