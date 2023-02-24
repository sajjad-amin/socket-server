function generateMD5(text) {
    let crypto = require('crypto');
    return crypto.createHash('md5').update(text).digest("hex");
}

function compareMD5(text, hash) {
    return hash === generateMD5(text);
}

function randomString(length) {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function createToken(userObject, expires = null) {
    const user = {
        id: userObject.id,
        name: userObject.name,
        email: userObject.email,
        verified: userObject.verified
    }
    const created = Math.floor(Date.now() / 1000);
    const expired = expires ? created + expires : created + 3600;
    const key = randomString(32);
    const signature = generateMD5(key);
    const token = btoa(JSON.stringify({user, created, expired, signature}));
    return {token, key};
}

function readToken(token) {
    return JSON.parse(atob(token));
}

module.exports = {
    generateMD5,
    compareMD5,
    randomString,
    createToken,
    readToken
};