const EventModel = require('../Models/EventModel');
const moment = require('moment');
class DashboardController {
  static async index(req, res) {
    let user = req.user;
    res.render('Dashboard/index', {
        user: user,
        data: await EventModel.getEventsByUserId(user.id),
        moment: moment
    });
  }
}
module.exports = DashboardController;