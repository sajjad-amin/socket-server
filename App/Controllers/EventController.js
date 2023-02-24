const EventModel = require('../Models/EventModel');
const moment = require('moment');
class EventController {
    static async createEvent(req, res) {
        const user_id = req.user.id;
        const title = req.body.title;
        const token = req.body.token;
        const comment = req.body.comment;
        const event = await EventModel.getEventByTitle(title);
        EventModel.getEventsByUserId(user_id).then((events) => {
            const date_created = moment().unix();
            let duplicateEvents = events.filter((event) => {
                return event.title === title && event.token === token;
            });
            if (duplicateEvents.length <= 0) {
                if (!event) {
                    EventModel.insertEvent(user_id, title, token, comment, date_created).then(() => {
                        res.redirect('/dashboard');
                    });
                }else{
                    res.redirect('/dashboard');
                }
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

    static matchEvent(config) {
        return EventModel.getOne('events', [`title='${config.event_name}'`,`token = '${config.event_token}'`])
    }

    static async isEventExist(req, res) {
        const title = req.body.title;
        const event = await EventModel.getOne('events', [`title='${title}'`]);
        if (event) {
            res.json({status: true});
        }else{
            res.json({status: false});
        }
    }
}
module.exports = EventController;