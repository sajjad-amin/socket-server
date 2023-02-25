const VerifiedUserMiddleware = (req, res, next) => {
    if(req.user.verified === '1') {
        next();
    }else{
        res.redirect('/auth/verify');
    }
}

module.exports = VerifiedUserMiddleware;