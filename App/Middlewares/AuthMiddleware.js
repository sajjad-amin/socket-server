const {generateMD5, compareMD5, readToken} = require('../../Core/Factory/Hash');
const UserModel = require('../Models/UserModel');

const AuthMiddleware = (req, res, next) => {
    const token = req.cookies.auth_token;
    if(!token) {
        res.redirect('/auth/login');
    }else{
        const auth_token = readToken(req.cookies.auth_token);
        UserModel.getUserTokens(auth_token.user.id).then((tokens) => {
           let activeToken = tokens.filter((token) => {
               return token.date_expired > Math.floor(Date.now() / 1000) && token.token === req.cookies.auth_token && compareMD5(token.key, auth_token.signature);
           });
           let expiredTokens = tokens.filter((token) => {
                return token.date_expired < Math.floor(Date.now() / 1000);
           });
           if(expiredTokens.length > 0) {
               expiredTokens.forEach((token) => {
                   UserModel.deleteToken(token.id);
               });
           }
           if(activeToken.length > 0) {
                req.user = auth_token.user;
                next();
           }else{
               res.cookie('auth_token', '', {expires: new Date(0)});
               res.redirect('/auth/login');
           }
        });
    }
}
module.exports = AuthMiddleware;