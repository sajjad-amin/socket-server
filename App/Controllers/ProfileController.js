const UserModel = require("../Models/UserModel");

class ProfileController {
  static index(req, res) {
    res.render('Profile/index', {user: req.user});
  }

  static deleteAccount(req, res) {
    let user = req.user;
    UserModel.deleteUser(user.id);
    res.cookie('auth_token', '', {expires: new Date(0)});
    res.redirect('/auth/login');
  }
}
module.exports = ProfileController;