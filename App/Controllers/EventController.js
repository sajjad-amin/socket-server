const EventModel = require('../Models/EventModel');
const moment = require('moment');
class EventController {
    static createEvent(req, res) {
        const user_id = req.user.id;
        EventModel.getEventsByUserId(user_id).then((events) => {
            const title = req.body.title;
            const token = req.body.token;
            const comment = req.body.comment;
            const date_created = moment().unix();
            let duplicateEvents = events.filter((event) => {
                return event.title === title && event.token === token;
            });
            if (duplicateEvents.length <= 0) {
                EventModel.insertEvent(user_id, title, token, comment, date_created).then(() => {
                    res.redirect('/dashboard');
                });
            }else{
                res.redirect('/dashboard');
            }
        });
    }

    static deleteEvent(req, res) {
        const id = req.body.id;
        EventModel.deleteEvent(id).then(() => {
            res.redirect('/dashboard');
        });
    }
}
module.exports = EventController;