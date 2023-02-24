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
AuthRouter.get('/verify/', AuthController.verify);
AuthRouter.post('/verify/', AuthController.resendVerifyEmail);
AuthRouter.get('/verify-account/:ext', AuthController.verifyAccount);
AuthRouter.get('/logout', AuthController.logout);
AuthRouter.get('/forgot-password', AuthController.forgot);
AuthRouter.post('/forgot-password', AuthController.forgotPost);
AuthRouter.get('/reset-password/:ext', AuthController.resetPassword);
AuthRouter.get('/:id', AuthController.resendVerifyEmail);

module.exports = AuthRouter;