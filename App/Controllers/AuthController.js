const userModel = require('../Models/UserModel');
const {validateName, validateEmail} = require('../../Core/Factory/Validation');
const {generateMD5, createToken, readToken, compareMD5} = require('../../Core/Factory/Hash');
const UserModel = require("../Models/UserModel");
class AuthController {
    static login(req, res) {
        res.render('Auth/login', { errors:null });
    }

    static loginPost(req, res) {
        const email = req.body.email;
        const password = req.body.password;
        const remember = req.body.remember;
        userModel.verifyUser(email, password).then((user) => {
            if(user) {
                let expires = null;
                if(remember) {
                    expires = 3600 * 24 * 15;
                }
                const {token, key} = createToken(user, expires);
                const tokenData = readToken(token);
                userModel.insertToken(user.id, key, token, tokenData.created, tokenData.expired).then(() => {
                    res.cookie('auth_token', token, {expires: new Date(tokenData.expired * 1000)});
                    res.redirect('/dashboard');
                });
            }else{
                res.render('Auth/login', {errors: ['Email or password is incorrect']});
            }
        });
    }

    static register(req, res) {
        res.render('Auth/register', { errors:null } );
    }

    static registerPost(req, res) {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const confirm_password = req.body.confirm_password;
        let errors = [];
        userModel.getUserByEmail(email).then((user) => {
            if(user) {
                errors.push('Email already exists');
            }else if(password !== confirm_password){
                errors.push('Passwords do not match');
            }else if(!validateName(name)){
                errors.push('Name is not valid');
            }else if(!validateEmail(email)){
                errors.push('Email is not valid');
            }
            if(errors.length > 0) {
                res.render('Auth/register', {errors});
            }else{
                userModel.insertUser(name, email, generateMD5(password)).then(() => {
                    res.redirect('/auth/login');
                });
            }
        });
    }

    static logout(req, res) {
        const token = req.cookies.auth_token;
        if(token) {
            const auth_token = readToken(req.cookies.auth_token);
            UserModel.getUserTokens(auth_token.user.id).then((tokens) => {
                let activeToken = tokens.filter((token) => {
                    return token.date_expired > Math.floor(Date.now() / 1000) && token.token === req.cookies.auth_token && compareMD5(token.key, auth_token.signature);
                })[0];
                userModel.deleteToken(activeToken.id).then(() => {
                    res.cookie('auth_token', '', {expires: new Date(0)});
                    res.redirect('/auth/login');
                });
            });
        }else{
            res.redirect('/auth/login');
        }
    }
}
module.exports = AuthController;