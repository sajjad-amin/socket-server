const Model = require('../../Core/Model/Model');

class ForgotModel extends Model {
    static getForgotToken(email){
        return this.getOne('forgot_password', [`email = '${email}'`]);
    }

    static insertForgotToken(email, token, data, expires){
        return this.insert('forgot_password',{email, token, data, expires});
    }

    static deleteForgotToken(email){
        return this.delete('forgot_password', [`email = '${email}'`]);
    }

    static updatePassword(email, password){
        return this.update('users', {password}, [`email = '${email}'`]);
    }
}

module.exports = ForgotModel;