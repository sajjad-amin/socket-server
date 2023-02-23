const {validateName, validateEmail} = require('../../Core/Factory/Validation');
const {generateMD5, createToken, readToken, compareMD5, randomString} = require('../../Core/Factory/Hash');
const nodeMailer = require('nodemailer');
const userModel = require('../Models/UserModel');
const forgotModel = require("../Models/ForgotModel");
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
        if(process.env.REGISTER_ENABLED === "true"){
            res.render('Auth/register', { errors:null } );
        }else{
            res.redirect('/auth/login');
        }
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

    static forgot(req, res) {
        res.render('Auth/forgot', { errors:null, message:null });
    }

    static async forgotPost(req, res) {
        const transporter = nodeMailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        const email = req.body.email;
        const password = req.body.password;
        const token = randomString(32);
        const base_url = req.protocol + '://' + req.get('host');
        const data = {
            email: email,
            password: generateMD5(password),
        };
        const expires = Math.floor(Date.now() / 1000) + 3600;
        userModel.getUserByEmail(email).then((user) => {
            // url
            if(user) {
                forgotModel.getForgotToken(email).then((existingToken) => {
                    if(existingToken) {
                        forgotModel.deleteForgotToken(email);
                        forgotModel.insertForgotToken(email, token, JSON.stringify(data), expires);
                    }else{
                        forgotModel.insertForgotToken(email, token, JSON.stringify(data), expires);
                    }
                });
                const mailOptions = {
                    from: process.env.MAIL_FROM,
                    to: email,
                    subject: 'SocketIO server password reset',
                    html: `<p>Click <a href="${base_url}/auth/reset-password/${token}.${btoa(email)}">here</a> to reset your SocketIO server account password</p>`
                };
                transporter.sendMail(mailOptions);
                res.render('Auth/forgot', {errors: null, message: 'An email has been sent to your email address. Please check your email to reset your password'});
            }else{
                res.render('Auth/forgot', {errors: ['Email not found'], message: null});
            }
        });
    }

    static resetPassword(req, res) {
        const ext = req.params.ext;
        const token = ext.split('.')[0];
        const email = atob(ext.split('.')[1]);
        forgotModel.getForgotToken(email).then((forgot) => {
            if(forgot && forgot.token === token && forgot.expires > Math.floor(Date.now() / 1000)) {
                const data = JSON.parse(forgot.data);
                forgotModel.updatePassword(data.email, data.password).then(() => {
                    forgotModel.deleteForgotToken(email);
                    res.render('Auth/reset-password', {errors: null, message: 'Password has been reset successfully'});
                });
            }else{
                res.render('Auth/reset-password', {errors: ['Link is invalid or expired'], message: null});
            }
        });
    }

    static logout(req, res) {
        const token = req.cookies.auth_token;
        if(token) {
            const auth_token = readToken(req.cookies.auth_token);
            userModel.getUserTokens(auth_token.user.id).then((tokens) => {
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