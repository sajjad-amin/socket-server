const Model = require('../../Core/Model/Model');
const {generateMD5} = require("../../Core/Factory/Hash");
class UserModel extends Model {
    static getUserByEmail(email){
        return this.getOne('users', [`email = '${email}'`]);
    }

    static getUserById(id){
        return this.getOne('users', [`id = '${id}'`]);
    }

    static getAllUsers(){
        return this.getAll('users');
    }

    static verifyUser(email, password){
        return this.getOne('users', [`email = '${email}'`, `password = '${generateMD5(password)}'`]);
    }

    static getUserTokens(user_id){
        return this.getAll('auth_token', [`user_id = '${user_id}'`]);
    }

    static deleteToken(id){
        return this.delete('auth_token', [`id = '${id}'`]);
    }

    static insertUser(name, email, password){
        return this.insert('users',{name, email, password});
    }

    static insertToken(user_id, key, token, date_created, date_expired){
        return this.insert('auth_token',{user_id, key, token, date_created, date_expired});
    }
}
module.exports = UserModel;