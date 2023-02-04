class DashboardController {
  static index(req, res) {
    let user = req.user;
    res.render('Dashboard/index', { user: user });
  }
}
module.exports = DashboardController;